import compose from './index'

describe('@common-utilities/', () => {
  describe('compose', () => {
    test('it composes', () => {
      const add1 = (val: number): number => val + 1;
      const add2 = (val: number): number => val + 2;
      const result = compose(add1, add2)
      expect(result(2)).toEqual(5)
    })
  })
})
