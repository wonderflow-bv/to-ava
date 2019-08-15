const { serial: test } = require('ava')
let outsideVar

test('test 1 > should work find', async (t) => {
  let insideVar = 3
  outsideVar = 2 + insideVar
  t.deepEqual(outsideVar, 5)
});
