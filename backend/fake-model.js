module.exports = {
  categories: [
    {
      id: 1,
      name: 'Warzywa',
      words: []
    },
    {
      id: 2,
      name: 'Owoce',
      words: [1, 2, 3]
    },
    {
      id: 3,
      name: 'Potrawy',
      words: []
    },
    {
      id: 4,
      name: 'Sztuka',
      words: []
    }
  ],
  words: [
    {
      id: 1,
      word: 'Apple',
      imageUrl: null,
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [1, 2],
    },
    {
      id: 2,
      word: 'Banana',
      imageUrl: null,
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [3],
    },
    {
      id: 3,
      word: 'Tangerine',
      imageUrl: 'https://cdn.pixabay.com/photo/2015/09/06/00/29/tangerines-926634_960_720.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      categories: [2],
      translations: [4],
    },
  ],
  wordTranslations: [
    {
      id: 1,
      wordId: 1,
      domain: 'ogólne',
      word: 'apple',
      wordTranslation: 'jabłko',
      example: 'zdanie z jabłkiem',
      exampleTranslation: 'Sentence with apple.'
    },
    {
      id: 2,
      wordId: 1,
      domain: 'ogólniejsze',
      word: 'apple',
      wordTranslation: 'jabłko2',
      example: 'inne zdanie z jabłkiem',
      exampleTranslation: 'Another sentence with apple.'
    },
    {
      id: 3,
      wordId: 2,
      domain: 'ogólne',
      word: 'banana',
      wordTranslation: 'banan',
      example: 'zdanie z bananem',
      exampleTranslation: 'Sentence with banana.'
    },
    {
      id: 4,
      wordId: 3,
      domain: 'ogólne',
      word: 'tangerine',
      wordTranslation: 'mandarynka',
      example: 'zdanie z mandarynką',
      exampleTranslation: 'Sentence with tangerine.'
    },
  ]
}
