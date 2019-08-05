test('test 1 > should work find', (t) => {
  const res = 2 + 3

  t.snapshot(res)

  t.truthy(res)
  t.falsy(res)

  t.true(res instanceof Object)
})