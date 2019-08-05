test('test 1 > should work find', (t) => {
  const res = 2 + 3

  t.snapshot(res)
  t.truthy(res)
  t.falsy(res)
})