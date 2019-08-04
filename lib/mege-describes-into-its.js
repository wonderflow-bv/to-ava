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

      // console.log(arrowFunction.toSource())

      const avaTest = j.callExpression(j.identifier('test'), [
        j.literal(avaTestName),
        arrowFunction
        // it.value.arguments[1]
      ])

      avaTests.push(avaTest)
    })
  })

  const src = j(avaTests).toSource({ quote: 'single' })

  return src
}
