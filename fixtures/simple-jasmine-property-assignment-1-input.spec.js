/* eslint-env jest */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000

describe('test 1', () => {
  beforeEach(() => {
    const fakeResult = 2 + 3
  })
  it('sum works', () => {
    const sum = 2 + 3
    expect(sum).toEqual(5)
  })
})
