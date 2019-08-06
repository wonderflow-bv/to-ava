/* eslint-env jest */

describe('test 1', () => {
  it('should work find', () => {
    const res = 2 + 3

    expect(res).toMatchSnapshot()

    expect(res).toBeDefined()
    expect(res).toBeUndefined()

    expect(res).toBeInstanceOf(Object)

    expect(res).toBeGreaterThan(0)
    expect(res).toBeGreaterThanOrEqual(0)

    expect(res).toBeLessThan(0)
    expect(res).toBeLessThanOrEqual(0)

    expect(res).toHaveLength(2)

    expect(res).toHaveProperty('length')

    expect(res).toContain('0')
    expect(res).toContainEqual('0')
  })
})
