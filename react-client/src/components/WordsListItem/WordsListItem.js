import React, { Component } from 'react';
import TranslationsList from '../TranslationsList/TranslationsList';

class WordsListItem extends Component {
  render() {
    return (
      <li className="word-list-item">
        <strong>{this.props.word.word}</strong>
        <button onClick={(word) => this.props.deleteWord(word)}>Delete</button>
        <TranslationsList word={this.props.word} />
      </li>
    );
  }
}

export default WordsListItem;
