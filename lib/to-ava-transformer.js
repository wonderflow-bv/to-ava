// const { findRequires, findImports } = require('./imports-utils')

const jestAssertionToAvaAssertion = {
  toEqual: 'deepEqual',
  toBe: 'deepEqual',
  toBeNull: 'deepEqual',
  toBeFalsy: 'falsy',
  toBeTruthy: 'truthy',
  toMatchSnapshot: 'snapshot',
  toBeDefined: 'truthy',
  toBeUndefined: 'falsy',
  toBeInstanceOf: 'true',

  toBeGreaterThan: 'true',
  toBeGreaterThanOrEqual: 'true',

  toBeLessThan: 'true',
  toBeLessThanOrEqual: 'true',

  toHaveLength: 'deepEqual',
  toHaveProperty: 'true'
}

const jestHookToAvaHook = {
  'beforeEach': 'beforeEach',
  'afterAll': 'after',
  'beforeAll': 'before',
  'afterEach': 'afterEach'
}

function getNewHooksByName (root, j, name) {
  const newHooks = []
  const hookExpressions = root.find(j.CallExpression, {
    callee: { name }
  })
  const avaNookName = jestHookToAvaHook[name]
  hookExpressions.forEach(b => {
    const newBeforeEach = j.memberExpression(
      j.identifier('test'),
      j.callExpression(j.identifier(avaNookName), b.value.arguments)
    )
    newBeforeEach.async = b.value.arguments[0].async
    newHooks.push(newBeforeEach)
  })
  return newHooks
}

function getNewHooks (root, j) {
  const newHooks = []
  newHooks.push(...getNewHooksByName(root, j, 'beforeEach'))
  newHooks.push(...getNewHooksByName(root, j, 'afterEach'))
  newHooks.push(...getNewHooksByName(root, j, 'beforeAll'))
  newHooks.push(...getNewHooksByName(root, j, 'afterAll'))
  return newHooks
}
function removeEslintEnvComment (root, j) {
  // remove comment eslint-env...
  root.find(j.Comment)
    .filter(c => {
      const commentAsString = c.value.value
      return commentAsString && commentAsString.match(/eslint-env.+jest/gi)
    })
    .forEach(path => path.prune())
}
function addAvaRequire (root, j) {
  // insert require('ava')
  const s = 'const { serial: test } = require(\'ava\')'
  root.get().node.program.body.unshift(s)
}

function findVariableDeclarationsInsideDescribe (j, root) {
  const variableDeclarations = []
  const describes = root.find(j.CallExpression, {
    callee: { name: 'describe' }
  })
  describes.forEach((d) => {
    const tmpVariableDeclarations = d.value.arguments[1].body.body.filter(e => e.type === 'VariableDeclaration').map(e => j(e))
    variableDeclarations.push(...tmpVariableDeclarations)
  })
  return variableDeclarations
}

function transformExpectations (j, expectations) {
  expectations.forEach((exp) => {
    const realValue = exp.node.arguments
    const assertionMethod = exp.parent.value.property.name
    const expectedValue = (exp.parent.parent.value && exp.parent.parent.value.arguments) ? exp.parent.parent.value.arguments : []

    const realValueIdentifier = (realValue[0].name) ? j.identifier(realValue[0].name) : realValue[0]

    let args = [realValueIdentifier, ...expectedValue]

    if (assertionMethod === 'toBeNull') {
      args.push(j.identifier('null'))
    }

    if (assertionMethod === 'toBeInstanceOf') {
      args = [j.binaryExpression('instanceof', realValueIdentifier, ...expectedValue)]
    }

    if (assertionMethod === 'toBeGreaterThan') {
      args = [j.binaryExpression('>', realValueIdentifier, ...expectedValue)]
    }
    if (assertionMethod === 'toBeGreaterThanOrEqual') {
      args = [j.binaryExpression('>=', realValueIdentifier, ...expectedValue)]
    }
    if (assertionMethod === 'toBeLessThan') {
      args = [j.binaryExpression('<', realValueIdentifier, ...expectedValue)]
    }
    if (assertionMethod === 'toBeLessThanOrEqual') {
      args = [j.binaryExpression('<=', realValueIdentifier, ...expectedValue)]
    }

    if (assertionMethod === 'toHaveLength') {
      const realValueIdentifierWithLength = j.memberExpression(
        realValueIdentifier,
        j.identifier('length')
      )

      args = [
        realValueIdentifierWithLength,
        ...expectedValue
      ]
    }

    if (assertionMethod === 'toHaveProperty') {
      const realValueIdentifierWithProperty = j.memberExpression(
        realValueIdentifier,
        expectedValue[0]
      )
      const typeOfExpression = j.unaryExpression('typeof', realValueIdentifierWithProperty)
      const undefinedAsString = j.literal('undefined')

      const booleanExpression = j.binaryExpression('!==', typeOfExpression, undefinedAsString)

      args = [booleanExpression]
    }

    if (!Object.keys(jestAssertionToAvaAssertion).includes(assertionMethod)) {
      const comment = j.commentLine(' TODO: ' + j(exp.parent.parent).toSource({ trailingComma: false }))
      comment.trailing = false
      return j(exp.parent.parent).replaceWith(comment)
    }

    const avaAssertion = jestAssertionToAvaAssertion[assertionMethod]

    const newAssertion = j.memberExpression(
      j.identifier('t'),
      j.callExpression(j.identifier(avaAssertion), args)
    )

    return j(exp.parent.parent).replaceWith(newAssertion)
  })
}

const isNotTestFile = ({ path }) => !path.includes('test.') && !path.includes('spec.')

module.exports = (fileInfo, api) => {
  if (isNotTestFile(fileInfo)) {
    return fileInfo.source
  }

  const j = api.jscodeshift
  const root = j(fileInfo.source)

  addAvaRequire(root, j)
  removeEslintEnvComment(root, j)
  const newHooks = getNewHooks(root, j)

  // get all describe
  const describeExpressions = root.find(j.CallExpression, {
    callee: { name: 'describe' }
  })

  const allDescribeVariableDeclarations = []

  describeExpressions.forEach(c => {
    // convert it into
    const describeName = c.value.arguments[0].value

    const tests = j(c).find(j.CallExpression, { callee: { name: 'it' } })

    allDescribeVariableDeclarations.push(...findVariableDeclarationsInsideDescribe(j, root))

    tests.forEach(it => {
      const avaTestName = `${describeName} > ${it.value.arguments[0].value}`

      const arrowFunction = j.arrowFunctionExpression(
        [j.identifier('(t)')],
        it.value.arguments[1].body,
        false
      )

      // set async to the test cb
      arrowFunction.async = it.value.arguments[1].async

      const expectations = j(it.value.arguments[1]).find(j.CallExpression, { callee: { name: 'expect' } })

      transformExpectations(j, expectations)

      const avaTest = j.callExpression(j.identifier('test'), [
        j.literal(avaTestName),
        arrowFunction
      ])

      return j(c).replaceWith(avaTest)
    })
  })

  // add before eaches
  root.find(j.ExpressionStatement, { expression: { callee: { name: 'test' } } })
    .forEach((path, index) => {
      if (!index) {
        newHooks.forEach((el) => {
          j(path).insertBefore(j(el).toSource())
        })
        allDescribeVariableDeclarations.forEach(el => {
          j(path).insertBefore(el.toSource())
        })
      }
    })

  const src = root.toSource({ quote: 'single', trailingComma: false, wrapColumn: 174 })

  return src
}
