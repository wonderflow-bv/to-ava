/* eslint-env jest */

let outsideVar

beforeEach(() => {
  outsideVar = 2
})

describe('test 1', () => {

  test.each([
    [2, 4],
    [3, 6]
  ])('should return the double', (input, expected) => {
    expect(input * 2).toEqual(expected)
  })
})
