// const { findRequires, findImports } = require('./imports-utils')

const toSourceOptions = { quote: 'single', trailingComma: false, wrapColumn: 174 }
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
function removeGlobalJasminePropertyAssignments (root, j) {
  root.find(j.ExpressionStatement, { expression: { left: { object: { name: 'jasmine' } } } })
    .forEach((path) => {
      path.prune()
    })
}
function removeJestHooksByName (root, j, name) {
  root.find(j.CallExpression, {
    callee: { name }
  })
    .forEach(path => path.prune())
}
function removeAllJestHooks (root, j, name) {
  const hookNames = Object.keys(jestHookToAvaHook)
  hookNames.forEach(name => removeJestHooksByName(root, j, name))
}

function getNewHooksByName (root, j, name) {
  const newHooks = []
  const hookExpressions = root.find(j.CallExpression, {
    callee: { name }
  })

  const avaNookName = jestHookToAvaHook[name]
  hookExpressions.forEach(b => {
    const expectations = j(b.value.arguments[0]).find(j.CallExpression, { callee: { name: 'expect' } })

    if (expectations.size() > 0) {
      transformExpectations(j, expectations)

      const newArrowFunction = j.arrowFunctionExpression(
        [j.identifier('(t)')],
        b.value.arguments[0].body
      )

      b.value.arguments[0] = newArrowFunction
    }

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
    .filter(describe => {
      const commentAsString = describe.value.value
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
      const comment = j.commentLine(' TODO: ' + j(exp.parent.parent).toSource(toSourceOptions))
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

function getNewIts (root, j, describeName, tests) {
  const newAvaTests = []

  tests.forEach(test => {
    const avaTestName = `${describeName} > ${test.value.arguments[0].value}`

    const arrowFunction = j.arrowFunctionExpression(
      [j.identifier('(t)')],
      test.value.arguments[1].body,
      false
    )

    // set async to the test cb
    arrowFunction.async = test.value.arguments[1].async

    const expectations = j(test.value.arguments[1]).find(j.CallExpression, { callee: { name: 'expect' } })

    transformExpectations(j, expectations)

    const avaTest = j.callExpression(j.identifier('test'), [
      j.literal(avaTestName),
      arrowFunction
    ])

    newAvaTests.push(avaTest)
  })

  return newAvaTests
}

const isNotTestFile = ({ path }) => !path.includes('test.') && !path.includes('spec.')

function getNewTestsWithMacros (j, root, describe, describeName) {
  const testEaches = j(describe).find(j.ExpressionStatement, { expression: { callee: { callee: { property: { name: 'each' } } } } })
  const testsWithMacros = []
  testEaches.forEach((testEach, indexTestEach) => {
    const call = testEach.get('expression')
    const args = call.get('arguments')
    const testVariables = call.get('callee').get('arguments').value[0].elements
    const macroName = `macro${indexTestEach}`

    // create macro
    const bodyOfMacro = args.value[1].body

    const expectationsInMacro = j(bodyOfMacro).find(j.CallExpression, { callee: { name: 'expect' } })
    transformExpectations(j, expectationsInMacro)

    const macro = j.functionDeclaration(
      j.identifier(macroName + ' '),
      [j.identifier('t'), ...args.value[1].params],
      bodyOfMacro
    )
    macro.async = args.value[1].async

    testsWithMacros.push(macro)
    // end create macro

    testVariables.forEach((entry, index) => {
      const originalArgs = (entry.elements) ? [...entry.elements] : [entry]
      const call = j.callExpression(j.identifier('test'), [
        j.literal(`${describeName} > ${args.value[0].value} ${index + 1}/${testVariables.length}`),
        j.identifier(macroName),
        // args.value[1],
        ...originalArgs
      ])
      testsWithMacros.push(call)
    })
  })
  return testsWithMacros
}

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
  const describeExpressions = root.find(j.ExpressionStatement, {
    expression: {
      callee: { name: 'describe' }
    }
  })

  const allDescribeVariableDeclarations = []

  describeExpressions
    .forEach(describe => {
      const call = describe.get('expression')
      const param = call.get('arguments', 0)

      const describeName = param.value.value

      allDescribeVariableDeclarations.push(...findVariableDeclarationsInsideDescribe(j, root))

      const testsWithMacros = getNewTestsWithMacros(j, root, describe, describeName)

      const tests = j(describe).find(j.CallExpression, { callee: { name: 'it' } })

      const newAvaTests = getNewIts(root, j, describeName, tests)

      newAvaTests.forEach(newAvaTest => {
        const avaTest = j(newAvaTest).toSource(toSourceOptions)
        j(describe).insertAfter(avaTest)
      })
      testsWithMacros.forEach(newTestWithMacro => {
        const testWithMacro = j(newTestWithMacro).toSource(toSourceOptions)
        j(describe).insertAfter(testWithMacro)
      })
    })

  root.find(j.ExpressionStatement, { expression: { callee: { name: 'describe' } } })
    .forEach((path, index) => {
      if (!index) {
        newHooks.forEach((el) => {
          j(path).insertBefore(j(el).toSource(toSourceOptions))
        })
        allDescribeVariableDeclarations.forEach(el => {
          j(path).insertBefore(el.toSource(toSourceOptions))
        })
      }
    })

  describeExpressions.forEach(path => path.prune())
  removeAllJestHooks(root, j)
  removeGlobalJasminePropertyAssignments(root, j)

  const src = root.toSource(toSourceOptions)

  // console.log(`src`, src)

  return src
}
