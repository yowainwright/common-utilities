import name from './index'

describe('@common-utilities/name', () => {
  describe('head', () => {
    test('it returns the first item (the head) of an array', () => {
      const input = Array.from(Array(10).keys())
      const result = name(input)
      expect(result).toEqual(0)
    })
  })
})
