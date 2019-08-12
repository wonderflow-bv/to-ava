const { serial: test } = require('ava')

test.beforeEach(() => {
  const fakeResult = 2 + 3
})

test.afterEach(async () => {
  const fakeResult = 2 + 3
})

test.before(() => {
  const fakeResult = 2 + 3
})

test.after(() => {
  const fakeResult = 2 + 3
})

test('test 1 > should work find', async (t) => {
  const res = 2 + 3
  t.deepEqual(res.length, 5)
});
