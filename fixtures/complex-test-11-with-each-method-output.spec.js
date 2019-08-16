const { serial: test } = require('ava')

function macro1 (t, input, expected) {
  t.deepEqual(input * 2, expected)
}

let outsideVar;

test.beforeEach(() => {
  outsideVar = 2
})

test('test 1 > should work find 1/2', macro1, 2, 4)
test('test 1 > should work find 2/2', macro1, 3, 6)