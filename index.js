function getAllRequire (j, root) {
  const res = []
  const imports = root.find(j.VariableDeclaration).filter(i => {
    const res = j(i).find(j.VariableDeclarator, { init: { callee: { name: 'require' } } })
    return res.length
  })
  imports.forEach((i) => {
    res.push(j(i).toSource())
  })
  return res
}

function refactor (fileInfo, api) {
  const avaTests = []
  // const avaTest = {
  //   it: 'should do that',
  //   callback: () => { }
  // }

  const j = api.jscodeshift

  const root = j(fileInfo.source)

  const requires = getAllRequire(j, root)
  console.log('req', requires)
  requires.forEach(r => avaTests.push(r))
  // avaTests.push(...requires)
  // console.log(imports.toSource())
  // console.log('root', root)

  // const imports = root.find(j.ImportExpression)

  // imports.forEach((i) => {
  //   console.log('imports', i.toSource())
  //   console.log('>>ola')
  // })

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
    // res.remove()
  })
  // console.log('>', callExpressions)

  // console.log('>', callExpressions.toSource())

  // callExpressions.remove()

  const src = root.toSource()

  // console.log('src', src)

  // const ast = j.callExpression(j.identifier('it'), [
  //   j.literal('hello')
  // ])
  console.log('avaTests', avaTests)
  console.log('!!', j(avaTests).toSource())

  return src
}

module.exports = refactor
