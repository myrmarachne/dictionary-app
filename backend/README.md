# Instalacja

Trzeba mieć zainstalowane node.js i npm.

Instalacja zależności backendu:  
`npm install`

# Uruchomienie serwera

Polecenie:  
`npm start`

Serwer uruchomi się pod adresem http://localhost:3000/

# API

## Modele

Backend serwuje trzy modele:
* category
* word
* word-translation

category i word łączy relacja n-n, word i word-translation relacja 1-n.

### Category

JSON typowej kategorii:
```javascript
{
    id: 1,
    name: 'jakaskategoria',
    words: [1, 2, 3, ...], // tablica id słów w kategorii
    learnedWordsThisWeek: 1, // liczba slówek nauczonych w tym tygodniu (do statystyk). Wartość wyliczana przez serwer == niemodyfikowalna
    learnedWordsBeforeThisWeek: 12, // liczba słówek nauczonych więcej niż tydzień temu (do statystyk). Wartość wyliczana przez serwer == niemodyfikowalna
}
```

### Word

JSON typowego słowa:
```javascript
{
    id: 1,
    word: 'apple', // słówko
    imageUrl 'asdf/asdf.jpg' // url do obrazka dla słówka
    creationTime: czas, // czas utworzenia (uzupełnia serwer)
    learnedTime: czas, // czas wyuczenia (to już ustawia klient)
    categories: [tablica_id], // lista id kategorii, do których należy słowo
    translations: [tablica_id] // lista id translacji opisujących słowo
}
```

Pola `creationTime` i `learnedTime` są w formacie `Sun May 20 2018 00:33:30 GMT+0200 (CEST)`. Jest to obiekt Date zrzutowany na string. Konwersja w jedną stronę: `word.learnedTime = (new Date()).toString()`, w drugą stronę: `new Date(word.learnedTime)`.

Serwer nie akceptuje uploadu obrazków (więc nie gui też go nie akceptuje lepiej). `imageUrl` powinno być urlem to jakiegoś zasobu z internetu.

### Word-translation

JSON typowej translacji:
```javascript
{
    id: 1,
    wordId: 2, // id słowa, którego tyczy się translacja
    domain: 'ogólne', // dziedzina translacji
    word: 'apple', // słowo przed tłumaczeniem
    wordTranslation: 'jabłko', // słowo po tłumaczeniu
    example: 'zdanie z jabłkiem', // przykład przed tłumaczeniem
    exampleTranslation: 'Sentence with apple.' // przykład po tłumaczeniu
}
```

## REST

Uwaga: ciągi z dwukropkiem na początku oznaczają "jakąś zmienną", którą trzeba tam podać. Przykład: `/categories/:id` powinien być czymś w postaci np. `/categories/4`

### Kategorie
* `GET /categories`  
zwróci tablicę id kategorii, np: `[1, 2, 3]`,
* `POST /categories`  
utworzy nową kategorię korzystając z danych w body requesta, które powinno być jsonem kategorii. Pola `id`, `words`, `learnedWordsThisWeek`, `learnedWordsBeforeThisWeek` są ignorowane, bo na tym etapie nie mają sensu. Zwraca json kategorii z uzupełnionymi danymi, w tym `id`.
* `GET /categories/:id`  
zwróci json kategorii o podanym id.
* `PUT /categories/:id`  
zaktualizuje kategorię nowymi danymi przesłanymi w body. W body musi się znajdować cały json kategorii (może poza `learnedWordsThisWeek`, `learnedWordsBeforeThisWeek`). Zmiana id w tablicy `words` oznaczać będzie dodanie/wyrzucenie słówek z kategorii.
* `DELETE /categories/:id`  
usunięcie kategorii o podanym id. Autmatycznie usuwa powiązania ze słówkami.

### Słówka
* `GET /words`  
zwróci tablicę id słówek, np: `[1, 2, 3]`. Uwaga: ich kolejność nie jest związana z żadną kategorią. Dostępne są query paramsy do tego:
    * `type` - dostępne wartości: `normal` (wszystkie - domyślnie), `hard` (trudne), `last` (ostatnio dodane),
    * `limit` - liczba słówek, które chcemy. Domyślnie to 0, czyli wszystkie.  
Przykłady:  
    * wszystkie słówka: `/words`,
    * 10 ostatnio dodanych `/words?type=last&limit=10`,
    * 10 trudnych `/words?type=hard&limit=10`

* `POST /words`  
utworzy nowe słówko korzystając z danych w body requesta, które powinno być jsonem słówka. Pola `id`, `creationTime`, `translations` są ignorowane, bo na tym etapie nie mają sensu. Zwraca json słówka z uzupełnionymi danymi, w tym `id` i `creationTime`.
* `GET /words/:id`  
zwróci json słówka o podanym id.
* `PUT /words/:id`  
zaktualizuje słówko nowymi danymi przesłanymi w body. W body musi się znajdować cały json słówka. Zmiana id w tablicy `categories` oznaczać będzie dodanie/wyrzucenie słówka z kategorii. Wyrzucenie id z tablicy `translations` oznaczać będzie usunięcie tej konkretnej translacji dla tego słowa. Uwaga: podpinać translacje do słowa można tylko poprzez utworzenie nowej translacji! Nie wolno samemu dodawac id do tablicy `translations` i jej zapisywać.
* `DELETE /words/:id`  
usunięcie słówka o podanym id. Automatycznie usuwa wszystkie translacje z nim powiązane.

### Translacje słówek
* `GET /word-translations`  
zwróci tablicę id translacji, np: `[1, 2, 3]` (pewnie to nie będzie używane. Wprowadzone dla spójności),
* `POST /word-translations`  
utworzy nową translację korzystając z danych w body requesta, które powinno być jsonem translacji. Pole `id` jest ignorowane, bo na tym etapie nie ma sensu. Zwraca json translacji z uzupełnionymi danymi, w tym `id`.
* `GET /word-translations/:id`  
zwróci json translacji o podanym id.
* `PUT /word-translations/:id`  
zaktualizuje translację nowymi danymi przesłanymi w body. W body musi się znajdować cały json translacji. Niedopuszczalna jest zmiana `wordId`. Raz stworzona translacja jest przywiązana do danego słówka na zawsze. [Zabawa w próby przepięcia translacji rozwali backend ;D. Nie polecam]
* `DELETE /word-translations/:id`  
usunięcie translacji o podanym id. Automatycznie usuwa powiązanie ze słówkiem.

Taka uwaga ogólna: zapisując zmiany w jednym modelu oczywistym jest, że nie zostaną one zsynchronizowane z modelami pobranymi juz przez klienta. Przykład: jeżeli utworzymy nowe słówko w danej kategorii (przez POST na /words), to pobrany przez nas wcześniej obiekt kategorii o tym nie wie i albo trzeba go pobrać ponownie albo samemu dodać jeden id do tablicy `words` (tak chyba jest najprościej). Inaczej rozjedzie się nam stan frontendu i backendu.

Plik fake-model.js jest po to, by się nim bawić. Jak ktoś na swoje potrzeby zrobi bardziej złożony, to niech zacommituje ;).
