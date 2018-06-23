module.exports = {
  categories: [
    {
      id: 1,
      name: 'Warzywa',
      words: [4, 5, 6, 7]
    },
    {
      id: 2,
      name: 'Owoce',
      words: [1, 2, 3, 8, 9]
    },
    {
      id: 3,
      name: 'Potrawy',
      words: [4, 5]
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
      translations: [1, 2, 6],
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
      categories: [1, 3],
      translations: [5, 7],
    },
    {
      id: 5,
      word: 'Potato',
      imageUrl: 'https://www.ang.pl/img/slownik/potato.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [1, 3],
      translations: [8,9],
    },
    {
      id: 6,
      word: 'Pumpkin',
      imageUrl: 'https://www.ang.pl/img/slownik/pumpkin.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [1],
      translations: [10],
    },
    {
      id: 7,
      word: 'Pea',
      imageUrl: 'https://www.ang.pl/img/slownik/pea.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [1],
      translations: [11, 12],
    },    
    {
      id: 8,
      word: 'Pear',
      imageUrl: 'https://www.ang.pl/img/slownik/pear.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [13],
    },
    {
      id: 9,
      word: 'Peach',
      imageUrl: 'https://www.ang.pl/img/slownik/peach.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [14, 15],
    },    
    {
      id: 10,
      word: 'Blueberry',
      imageUrl: 'https://www.ang.pl/img/slownik/blueberry.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [16],
    },
    {
      id: 11,
      word: 'Cherry',
      imageUrl: 'https://www.ang.pl/img/slownik/cherry.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [17],
    },
    {
      id: 12,
      word: 'Apricot',
      imageUrl: 'https://www.ang.pl/img/slownik/apricot.jpg',
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [18],
    },        
          
  ],
  wordTranslations: [
    {
      id: 1,
      wordId: 1,
      domain: 'ogólne',
      word: 'apple',
      wordTranslation: 'jabłko',
      example: 'To jabłko jest tym samym co ta dyskietka.',
      exampleTranslation: 'This apple is the same thing as this floppy disk.'
    },
    {
      id: 2,
      wordId: 1,
      domain: 'Botanika',
      word: 'apple',
      wordTranslation: 'jabłoń',
      example: 'inne zdanie z jabłkiem',
      exampleTranslation: "So in an apple orchard, for instance, you'll have rows of 10 apples of one variety, and then you have another apple tree that's a different type of pollen."
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
      domain: 'ogólne (warzywo)',
      word: 'carrot',
      wordTranslation: 'marchewka',
      example: 'We can use a carrot and stick policy, but there must be more carrot.',
      exampleTranslation: 'Możemy zastosować politykę kija i marchewki, lecz marchewki powinno być więcej niż kija.'
    },
    {
      id: 6,
      wordId: 1,
      domain: 'przymiotnik',
      word: "apple",
      wordTranslation: "jabłkowy",
      example: "Alternatywnie tabletka może być rozpuszczona tuż przed podaniem w pełnej szklance wody lub innego odpowiedniego napoju (sok pomarańczowy, sok jabłkowy, mleko lub kawa).",
      exampleTranslation: "Alternatively, it may be dispersed in a full glass of water or other suitable beverage (orange juice, apple juice, milk or coffee) immediately before administration."
    },
    {
      id: 7,
      wordId: 4,
      domain: 'Botanika',
      word: 'carrot',
      wordTranslation: 'marchew',
      example: "Nie zapatrzymy się w nasiono marchwi tak, jak w misia pandę, ale to bardzo ważny rodzaj bioróżnorodności.",
      exampleTranslation: "You don't look in the eyes of a carrot seed quite in the way you do a panda bear, but it's very important diversity."
    },    
    {
      id: 8,
      wordId: 5,
      domain: 'Gastronomia',
      word: "potato",
      wordTranslation: "ziemniak",
      example: "Oto skromny ziemniak. Spędziłem 25 lat przygotowując je.",
      exampleTranslation: "The humble potato - and I've spent a long time, 25 years, preparing these."
    },
    {
      id: 9,
      wordId: 5,
      domain: 'ogólne',
      word: "potato",
      wordTranslation: "kartofel",
      example: "Problem wraca, a więc jest to taki 'gorący kartofel'.",
      exampleTranslation: "The problem has come back again, and it is a kind of hot potato."
    }, 
    {
      id: 10,
      wordId: 6,
      domain: 'Gastronomia',
      word: "pumpkin",
      wordTranslation: "dynia",
      example: "W restauracji Chez Panisse podają sashimi z prażonymi pestkami dyni, w jakimś wywarze.",
      exampleTranslation: "You go to Chez Panisse, they give you the red-tail sashimi with roasted pumpkin seeds in a something something reduction."
    },
    {
      id: 11,
      wordId: 7,
      domain: 'ogólne',
      word: "peas",
      wordTranslation: "groch",
      example: "Katastrofa dotknęła też grunty uprawne, w tym 75% brytyjskich upraw grochu.",
      exampleTranslation: "Agricultural land has been affected, including 75% of the pea crop in the UK."
    },
    {
      id: 12,
      wordId: 7,
      domain: 'przymiotnik',
      word: "pea",
      wordTranslation: "grochowy",
      example: "Słynne specjalności kuchni holenderskiej to surowy śledź, wędzony węgorz i zupa grochowa oraz oczywiście słynne holenderskie sery, jak Edam czy Gouda.",
      exampleTranslation: "Well-known Dutch specialities include raw herring, smoked eel and pea soup, as well as a wide variety of cheeses such as Edam and Gouda."
    },    
    {
      id: 13,
      wordId: 8,
      domain: 'ogólne',
      word: "Pear",
      wordTranslation: "gruszka",
      example: "W południowo-zachodniej Anglii z zadowoleniem przyjąłbym wymianę naszych doskonałych lokalnych odmian jabłek i gruszek na banany z Cypru i Wysp Kanaryjskich.",
      exampleTranslation: "In the South West of England I would welcome the exchange of our splendid local varieties of apples and pears for the bananas of Cyprus and the Canaries."
    },    
    {
      id: 14,
      wordId: 9,
      domain: 'ogólne',
      word: "Peach",
      wordTranslation: "brzoskwinia",
      example: "Powinna pani wiedzieć, że producentów brzoskwiń w Grecji ogarnia gniew.",
      exampleTranslation: "You should know that anger is rife among peach producers in Greece."
    },    
    {
      id: 15,
      wordId: 9,
      domain: "'on sb', potoczny",
      word: "to peach",
      wordTranslation: "zakablować na",
      example: "",
      exampleTranslation: ""
    },
    {
      id: 16,
      wordId: 10,
      domain: 'Botanika',
      word: "Blueberry",
      wordTranslation: "Borówka amerykańska",
      example: "",
      exampleTranslation: ""
    },
    
    {
      id: 17,
      wordId: 11,
      domain: 'ogólne',
      word: "Cherry",
      wordTranslation: "Wiśnia",
      example: "Inne składniki leku zawarte w proszku to substancja zapachowa wiśniowa metylu.",
      exampleTranslation: "The other ingredients of the powder are: cherry flavour methylhydroxybenzoate (E218)."
    },    
    {
      id: 18,
      wordId: 12,
      domain: 'Botanika',
      word: "apricot",
      wordTranslation: "Morela",
      example: "Połówki moreli jak uszy cherubina.",
      exampleTranslation: "Apricot halves like the ears of cherubim."
    },    

  ]
}
