/* eslint-env jest */

describe('test 1', () => {
  it('should work find', () => {
    const res = 2 + 3
    expect(res).toEqual(5)

    expect(res).toBe(5)

    expect(res).toBeNull()

    expect(res).toBeFalsy()
    expect(res).toBeTruthy()
  })
})
