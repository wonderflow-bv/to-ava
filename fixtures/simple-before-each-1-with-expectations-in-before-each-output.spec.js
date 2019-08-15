const { serial: test } = require('ava')

test.beforeEach((t) => {
  const fakeResult = 2 + 3
  t.deepEqual(fakeResult, 5)
})

test('test 1 > sum works', (t) => {
  const sum = 2 + 3
  t.deepEqual(sum, 5)
});
