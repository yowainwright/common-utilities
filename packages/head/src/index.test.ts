import head from './index'

describe('@common-utilities/', () => {
  describe('head', () => {
    test('it returns the first item (the head) of an array', () => {
      const input = Array.from(Array(10).keys())
      const result = head(input)
      expect(result).toEqual(0)
    })
  })
})
