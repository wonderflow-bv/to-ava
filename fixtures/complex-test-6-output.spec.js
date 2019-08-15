const { serial: test } = require('ava')

test('test 1 > should work find', async (t) => {
  const res = 2 + 3
  t.deepEqual(res.length, 5)
})
