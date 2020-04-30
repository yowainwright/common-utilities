import repeat from './index'

describe('@common-utilities/', () => {
  describe('repeat', () => {
    test('it repeats', () => {
      const add1 = (x) => x + 1
      const result = repeat(100)(add1)(0)
      expect(result).toEqual(100)
    })
  })
})
