import updateMarkdownList from './index'

describe('@common-utilities/updateMarkdownList', () => {
  it('it returns the first item (the head) of an array', () => {
    const input = Array.from(Array(10).keys())
    const result = updateMarkdownList(input)
    expect(result).toEqual(0)
  })
})
