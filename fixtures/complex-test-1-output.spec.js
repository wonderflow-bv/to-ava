const { serial: test } = require('ava')

test('test 1 > should work find', (t) => {
  const res = 2 + 3
  t.deepEqual(res, 5)

  t.deepEqual(res, 5)

  t.deepEqual(res, null)

  t.falsy(res)
  t.truthy(res)
})
