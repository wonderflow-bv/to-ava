/* eslint-env jest */

let outsideVar

beforeEach(() => {
  outsideVar = 2
})

describe('test 1', () => {
  test.each([
    'str 1',
    'str 2'
  ])('should return the substr', (input) => {
    input = input.substr(0, 1)
    expect(input).toEqual('s')
  })
})
