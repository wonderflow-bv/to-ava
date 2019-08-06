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

module.exports = (fileInfo, api) => {
  // console.log(fileInfo)
  const avaTests = []

  const j = api.jscodeshift

  const root = j(fileInfo.source)

  // get all describe
  const callExpressions = root.find(j.CallExpression, {
    callee: { name: 'describe' }
  })

  callExpressions.forEach(c => {
    // convert it into
    const describeName = c.value.arguments[0].value

    const res = j(c).find(j.CallExpression, { callee: { name: 'it' } })

    res.forEach(it => {
      const avaTestName = `${describeName} > ${it.value.arguments[0].value}`

      const arrowFunction = j.arrowFunctionExpression(
        [j.identifier('(t)')],
        it.value.arguments[1].body,
        false
      )

      const tmp = j(it.value.arguments[1]).find(j.CallExpression, { callee: { name: 'expect' } })
      tmp.forEach((exp) => {
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

        // console.log(console.log(exp.value.parent))

        if (!Object.keys(jestAssertionToAvaAssertion).includes(assertionMethod)) {
          const comment = j.commentLine(' TODO: ' + j(exp.parent.parent).toSource({ trailingComma: false }))
          comment.trailing = false
          // j(exp.parent.parent.path).insertBefore(j.commentLine(j(exp.parent.parent).toSource()))
          // console.log('exp.parent.parent', Object.keys(exp.parent.parent.value))
          return j(exp.parent.parent).replaceWith(comment)
        }

        const avaAssertion = jestAssertionToAvaAssertion[assertionMethod]

        const newAssertion = j.memberExpression(
          j.identifier('t'),
          j.callExpression(j.identifier(avaAssertion), args)
        )

        // newAssertion.comments = [j.commentLine('c1'), j.commentLine('c2')]

        return j(exp.parent.parent).replaceWith(newAssertion)
      })

      const avaTest = j.callExpression(j.identifier('test'), [
        j.literal(avaTestName),
        arrowFunction
      ])

      avaTests.push(avaTest)
    })
  })

  const src = j(avaTests).toSource({ quote: 'single' })

  return src
}
