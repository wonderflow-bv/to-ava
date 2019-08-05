/* eslint-env jest */

describe('test 1', () => {
  it('should work find', () => {
    const res = 2 + 3

    expect(res).toMatchSnapshot()

    expect(res).toBeDefined()
    expect(res).toBeUndefined()

    expect(res).toBeInstanceOf(Object)
  })
})
