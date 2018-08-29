import React, { Component } from 'react';
import TranslationsList from '../TranslationsList/TranslationsList';
import { Link } from 'react-router-dom';

class WordsListItem extends Component {

  constructor(props){
    super(props);

    this.state = {
      checked : true,
    };
  }

  static getDerivedStateFromProps(props, state){
    if (props.checked !== state.checked && props.checked != null){
      return ({
        checked : props.checked
      });
    } else return null;
  }

  render() {

    const word = this.props.word;
    const wordText = word.word;

    return (
      <div className="letter-word-description">
        <div className="word-header">
            <Link className="word-header-link" to={`/words/${word.id}`}>{wordText}</Link>
            <label className="checkbox-container">
                <input type="checkbox"
                  checked={this.state.checked} 
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
