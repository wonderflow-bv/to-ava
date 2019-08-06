test('test 1 > should work find', (t) => {
  const res = 2 + 3

  t.snapshot(res)

  t.truthy(res)
  t.falsy(res)

  t.true(res instanceof Object)

  t.true(res > 0)
  t.true(res >= 0)

  t.true(res < 0)
  t.true(res <= 0)

  t.deepEqual(res.length, 2)

  t.true(typeof res['length'] !== 'undefined')

  // TODO: expect(res).toContain('0');
  // TODO: expect(res).toContainEqual('0');
})