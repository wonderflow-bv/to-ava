const { serial: test } = require('ava')

let outsideVar;

test.beforeEach(() => {
  outsideVar = 2
})

test('test 1 > should return the substr 2/2', macro0, 'str 2')
test('test 1 > should return the substr 1/2', macro0, 'str 1')

function macro0 (t, input) {
  input = input.substr(0, 1)
  t.deepEqual(input, 's')
}
