import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';

import WordsListItem from '../WordsListItem/WordsListItem';

class WordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: undefined,
      words: undefined,
      wordsLoading: false,
      wordsLoadError: null,
    }
  }

  componentDidMount() {
    this.loadWords(this.props.category);
  }

  componentWillReceiveProps(props){
    const category = this.props.category;

    if (props.category !== category) {
      this.loadWords(props.category);
    }
  }
  
  loadWords(category) {

    this.setState({
      words: undefined,
      wordsLoading: true,
      wordsLoadError: null,
    })

    Promise.all(category.words.map(id =>
      fetch(configuration.backendUrl + '/words/' + id)
        .then(response => response.json())
    ))
    .then(words => this.refreshWordsList(words))
    .catch((error) => {
      this.setState({
        words: undefined,
        wordsLoading: false,
        wordsLoadError: error,
      })
    });
  }

  refreshWordsList(words){

    const groupedWords = this.groupByFirstLetter(words || []);
    this.setState({
      words : groupedWords,
      wordsLoading: false,
      wordsLoadError: null,
    });

    this.props.setActiveletters(Object.keys(groupedWords));
  }

  deleteWord(word) {
    return this.props.deleteWord(word).then(() => {
      this.setState({
        words: this.state.words.filter(w => w !== word),
      });
    });
  }

  groupByFirstLetter(list) {
    // Group words by first letter
    return list.reduce(function(grouped, item){
      var key = item.word.charAt(0).toUpperCase();
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
    }, {});
  }

  render() {

    const groupedWords = this.state.words || [];
    
    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    var wordsForLetter = function(letter){
      return groupedWords[letter].map(word => 
        {
        return <WordsListItem key={word.id} word={word} checked={this.props.checkedWords[word.id]}
          selectWords={(word, value) => this.props.selectWords(word, value)}
           />}
      );
    }.bind(this);

    const letterCategory = alphabet.map(letter => {
      if (groupedWords[letter] != null)
        return (
          <div id={"category"+letter} key={"category"+letter} className="letter-category">
            <div className="letter-header">{letter}</div>
            {wordsForLetter(letter)}
          </div>
        );
      else return null;
    }
    );

    return (
      <div className="content-block categories-content">
        {letterCategory}
      </div>

    );
  }
}

export default WordList;

      /* <ul className="words-list">
      {
        this.state.words ? (
          this.state.words.map(word =>
            <WordsListItem key={word.id} word={word} deleteWord={() => this.deleteWord(word)} />
        )) : (
          <p>Ladowanie słów...</p>
        )
      }
    </ul>*/