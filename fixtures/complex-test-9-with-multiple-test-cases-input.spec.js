/* eslint-env jest */

describe('test 1', () => {
  let outsideVar

  it('should work find', async () => {
    let insideVar = 3
    outsideVar = 2 + insideVar
    expect(outsideVar).toEqual(5)
  })

  it('should work find', async () => {
    let insideVar = 3
    outsideVar = 2 + insideVar
    expect(outsideVar).toEqual(5)
  })
})
