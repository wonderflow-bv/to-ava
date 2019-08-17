const { serial: test } = require('ava')

let outsideVar;

test.beforeEach(() => {
  outsideVar = 2
})

test('test 1 > should return the double 2/2', macro0, 3, 6)
test('test 1 > should return the double 1/2', macro0, 2, 4)

function macro0 (t, input, expected) {
  t.deepEqual(input * 2, expected)
}
