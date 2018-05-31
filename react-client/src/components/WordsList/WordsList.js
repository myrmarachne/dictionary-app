import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';
import WordsListItem from '../WordsListItem/WordsListItem';

class WordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: undefined,
      wordsLoading: false,
      wordsLoadError: null,
    }
  }

  componentDidMount() {
    this.loadWords();
  }

  loadWords() {
    this.setState({
      words: undefined,
      wordsLoading: true,
      wordsLoadError: null,
    })
    Promise.all(this.props.category.words.map(id =>
      fetch(configuration.backendUrl + '/words/' + id)
        .then(response => response.json())
    ))
    .then(words => {
      this.setState({
        words,
        wordsLoading: false,
        wordsLoadError: null,
      })
    })
    .catch((error) => {
      this.setState({
        words: undefined,
        wordsLoading: false,
        wordsLoadError: error,
      })
    });
  }

  deleteWord(word) {
    return this.props.deleteWord(word).then(() => {
      this.setState({
        words: this.state.words.filter(w => w !== word),
      });
    });
  }

  render() {
    return (
      <ul className="words-list">
      {
        this.state.words ? (
          this.state.words.map(word =>
            <WordsListItem key={word.id} word={word} deleteWord={() => this.deleteWord(word)} />
        )) : (
          <p>Ladowanie słów...</p>
        )
      }
      </ul>
    );
  }
}

export default WordList;
