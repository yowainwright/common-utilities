import pipe from './index'

describe('@common-utilities/', () => {
  describe('pipe', () => {
    test('it pipes', () => {
      const add1 = (val: number): number => val + 1
      const add2 = (val: number): number => val + 2
      const result = pipe(add1, add2)
      expect(result(2)).toEqual(5)
    })
  })
})
