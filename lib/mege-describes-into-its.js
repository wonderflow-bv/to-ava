module.exports = (fileInfo, api) => {
  const avaTests = []

  const j = api.jscodeshift

  const root = j(fileInfo.source)

  const callExpressions = root.find(j.CallExpression, {
    callee: { name: 'describe' }
  })
  callExpressions.forEach(c => {
    const describeName = c.value.arguments[0].value

    const res = j(c).find(j.CallExpression, { callee: { name: 'it' } })

    res.forEach(it => {
      const avaTestName = `${describeName} > ${it.value.arguments[0].value}`

      const avaTest = j.callExpression(j.identifier('it'), [
        j.literal(avaTestName),
        it.value.arguments[1]
      ])

      avaTests.push(avaTest)
    })
  })

  const src = j(avaTests).toSource({ quote: 'single' })

  return src
}
