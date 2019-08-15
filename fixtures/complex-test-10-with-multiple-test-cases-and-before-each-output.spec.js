const { serial: test } = require('ava')

let outsideVar;

test.beforeEach(() => {
  outsideVar = 2
})

test.beforeEach(() => {
  anotherVar = 3
})

let anotherVar

test('test 1 > should work find', async (t) => {
  let insideVar = 3
  anotherVar = 2 + insideVar
  t.deepEqual(anotherVar, 5)
})

test('test 1 > should work find', async (t) => {
  let insideVar = 3
  anotherVar = 2 + insideVar
  t.deepEqual(anotherVar, 5)
})
