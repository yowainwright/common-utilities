import curry from './index'

describe('@common-utilities/curry', () => {
  describe('curry', () => {
    test('it returns the first item (the head) of an array', () => {
      const add = (num, num2, num3) => num + num2 + num3;
      const result = curry(add)(1, 2)(3)
      expect(result).toEqual(6)
    })
  })
})
