/* eslint-env jest */

describe('test 1', () => {
  beforeAll(() => {
    const fakeResult = 2 + 3
  })
  beforeEach(() => {
    const fakeResult = 2 + 3
  })
  afterAll(() => {
    const fakeResult = 2 + 3
  })
  afterEach(async () => {
    const fakeResult = 2 + 3
  })
  it('should work find', async () => {
    const res = 2 + 3
    expect(res.length).toEqual(5)
  })
})
