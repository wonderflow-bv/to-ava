module.exports = (fileInfo, api) => {
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
        const expectedValue = exp.parent.parent.value.arguments[0]

        const newAssertion = j.memberExpression(
          j.identifier('t'),
          j.callExpression(j.identifier('deepEqual'), [
            j.identifier(realValue[0].name),
            expectedValue
          ])
          // j.identifier('deepEqual')
        )

        return j(exp.parent.parent).replaceWith(newAssertion)

        // console.log()
      })
      // console.log(tmp)

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
