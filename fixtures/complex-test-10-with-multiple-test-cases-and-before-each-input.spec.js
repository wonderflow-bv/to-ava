/* eslint-env jest */

let outsideVar

beforeEach(() => {
  outsideVar = 2
})

describe('test 1', () => {
  let anotherVar

  beforeEach(() => {
    anotherVar = 3
  })

  it('should work find', async () => {
    let insideVar = 3
    anotherVar = 2 + insideVar
    expect(anotherVar).toEqual(5)
  })

  it('should work find', async () => {
    let insideVar = 3
    anotherVar = 2 + insideVar
    expect(anotherVar).toEqual(5)
  })
})
