import mergeObjects from '.'

const testItems = [
  {
    lonelyObj1: {
      broken: true,
      alone: true,
      complex: {
        cats: true,
        dogs: false,
      },
    },
    lonelyObj2: {
      broken: false,
      alone: false,
      complex: {
        likesCats: true,
      },
    },
    expected: {
      alone: false,
      broken: false,
      complex: { cats: true, dogs: false, likesCats: true },
    },
  },
  {
    lonelyObj1: {
      bummed: true,
      depressed: true,
      complex: {
        cats: false,
        dogs: true,
      },
      likes: ['home', 'yoga'],
    },
    lonelyObj2: {
      bummed: false,
      depressed: false,
      complex: {
        likesDogs: true,
      },
      likes: ['home', 'yoga'],
    },
    expected: {
      bummed: false,
      depressed: false,
      complex: { cats: false, dogs: true, likesDogs: true },
      likes: ['home', 'yoga'],
    },
  },
  {
    lonelyObj1: {
      bummed: true,
      depressed: true,
      complex: {
        cats: false,
        dogs: true,
      },
      likes: ['home', 'yoga'],
      person: {
        brain: {
          thoughts: true,
          thoughtTypes: ['easy', 'hard'],
        },
        bodyPart: [
          {
            name: 'arm',
          },
          {
            name: 'leg',
          },
        ],
      },
    },
    lonelyObj2: {
      bummed: false,
      depressed: false,
      complex: {
        likesDogs: true,
      },
      likes: ['home', 'yoga'],
      person: {
        brain: {
          ideas: true,
          thoughtTypes: ['small'],
        },
        bodyPart: [
          {
            name: 'arm',
          },
          {
            name: 'hand',
          },
        ],
      },
    },
    expected: {
      bummed: false,
      depressed: false,
      complex: { cats: false, dogs: true, likesDogs: true },
      likes: ['home', 'yoga'],
      person: {
        brain: {
          thoughts: true,
          thoughtTypes: ['easy', 'hard', 'small'],
          ideas: true,
        },
        bodyPart: [
          {
            name: 'arm',
          },
          {
            name: 'leg',
          },
          {
            name: 'arm',
          },
          {
            name: 'hand',
          },
        ],
      },
    },
  },
]

describe('mergeObjects', () => {
  testItems.forEach((obj) => {
    test(`test ${obj}`, () => {
      const result = mergeObjects(obj.lonelyObj1, obj.lonelyObj2)
      expect(result).toEqual(obj.expected)
    })
  })
})
