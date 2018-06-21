module.exports = {
  categories: [
    {
      id: 1,
      name: 'Warzywa',
      words: [4]
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
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Banana_and_cross_section.jpg/1024px-Banana_and_cross_section.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [3],
    },
    {
      id: 3,
      word: 'Tangerine',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/TangerineFruit.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      categories: [2],
      translations: [4],
    },
    	{
      id: 4,
      word: 'Carrot',
      imageUrl: 'https://t4.ftcdn.net/jpg/01/04/10/05/500_F_104100562_hptqaFEfkzz8vSK3fJyAkCLg4GEF97rg.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [1],
      translations: [5],
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
    	{
      id: 5,
      wordId: 4,
      domain: 'ogólne',
      word: 'carrot',
      wordTranslation: 'marchewka',
      example: 'zdanie z mandarynką',
      exampleTranslation: 'Sentence with carrot'
    },
  ]
}
