const { serial: test } = require('ava')

const a = require('a');
import * as b from './b'

test('test 1 > should work find', (t) => {
  const res = 2 + 3
  t.deepEqual(res.length, 5)
})
