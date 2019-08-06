/* eslint-env jest */

const a = require('a')
import * as b from './b'

describe('test 1', () => {
  it('should work find', () => {
    const res = 2 + 3
    expect(res.length).toEqual(5)
  })
})
