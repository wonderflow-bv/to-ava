/* eslint-env jest */

describe('test 1', () => {
  beforeEach(() => {
    const fakeResult = 2 + 3
  })
  it('sum works', () => {
    const sum = 2 + 3
    expect(sum).toEqual(5)
  })
})
