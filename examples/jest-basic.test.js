/* eslint-env jest */
const { fn } = require('./')

describe('test 1', () => {
  it('should work find', () => {
    const res = fn({})
    expect(res).toEqual(12)
  })
})
