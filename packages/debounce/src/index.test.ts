import { debounce } from './index'

describe('@common-utilities/', () => {
  describe('debounce', () => {
    it('executes just once', () => {
      jest.useFakeTimers()
      const callback = jest.fn()
      const debouncedCallback = debounce(callback, 10)
      Array.from({ length: 100 }, () => debouncedCallback())
      expect(callback).not.toHaveBeenCalled()
      jest.runAllTimers()
      expect(callback).toBeCalledTimes(1)
    })

    it('executes with args', () => {
      jest.useFakeTimers()
      let result = 1
      const add1 = (val) => {
        result = val + 1
      }
      debounce(add1, 10)(1)
      jest.runAllTimers()
      expect(result).toEqual(2)
    })
  })
})
