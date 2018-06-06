import React, { Component } from 'react';
import TranslationsList from '../TranslationsList/TranslationsList';
import { Link } from 'react-router-dom';

class WordsListItem extends Component {

  render() {

    const word = this.props.word;
    
    return (
      <div className="letter-word-description">
        <div className="word-header">
            <Link className="word-header-link" to={`/words/${word.id}`}>{word.word}</Link>
            <label className="checkbox-container">
                <input type="checkbox"
                  checked={this.props.checked} 
                  onChange={(event) => {
                    this.props.selectWords(word, event.target.checked)
                    }} />
                <span className="checkmark"></span>
            </label>
        </div>

        <TranslationsList word={this.props.word} />

      </div>
    );
  }
}

export default WordsListItem;
