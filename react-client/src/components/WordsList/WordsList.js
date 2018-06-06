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

  componentDidUpdate(prevProps, prevState, snapshot){

    if (prevProps.category !== this.props.category) {
      this.loadWords(this.props.category);
    } 

    /* If the filter passed from the parent changed:
     * update the active letter index
     * pass the list of words id's which are visible to the paren
     * */

    if (prevProps.filter !== this.props.filter){
      
      const filteredList = this.filterWords(this.props.filter);
      /* update Active Letters Index */
      this.updateLetterIndex(filteredList);

      /* update the Visible Words List */
      this.updateVisibleWords(filteredList);
    }
  }
  
  loadWords(category) {
    /* Fetch the data for this category */
        
    this.setState({
      words: undefined,
      wordsLoading: true,
      wordsLoadError: null,
    })

    Promise.all(category.words.map(id =>
      fetch(configuration.backendUrl + '/words/' + id)
        .then(response => response.json())
    ))
    .then(words => {
      this.setState({
        words : words,
        wordsLoading: false,
        wordsLoadError: null,
      });
  
      this.updateLetterIndex(words);
    })
    .catch((error) => {
      this.setState({
        words: undefined,
        wordsLoading: false,
        wordsLoadError: error,
      })
    });

  }

  updateLetterIndex(words){
    /* Update the active letters in the index, 
    in Category component */
    const groupedWords = this.groupByFirstLetter(words || []);
    this.props.setActiveletters(Object.keys(groupedWords));
  }

  updateVisibleWords(words){
    /* Update the array of word's ids, which are visible after 
    filtering, in Category component */

    this.props.setVisibleWords((words || []).map(word => word.id));
  }

  deleteWord(word) {
    return this.props.deleteWord(word).then(() => {
      this.setState({
        words: this.state.words.filter(w => w !== word),
      });
    });
  }

  groupByFirstLetter(list) {
    /* Group words from the list by their first letter and 
    return an object, where the key = first letter of words */
    return list.reduce(function(grouped, item){
      var key = item.word.charAt(0).toUpperCase();
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
    }, {});
  }

  filterWords(passedFilter){
    /* Find all words that start with the passedFilter value */
    const filter = (passedFilter) ? passedFilter.toUpperCase() : "";
    return (this.state.words || []).filter(
      word => word.word.toUpperCase().startsWith(filter)
    );
  }

  render() {

    /* Grouped words, after applying the passed from Category filter */
    const groupedWords = this.groupByFirstLetter(this.filterWords(this.props.filter));
    
    /* Function which maps words objects into WordsListItem */
    var wordsForLetter = function(wordsList){
      return wordsList.map(word => 
         <WordsListItem key={word.id} word={word} 
          checked={this.props.checkedWords[word.id]}
          selectWords={(word, value) => this.props.selectWords(word, value)} />
      );
    }.bind(this);

    /* Map each letter, which contains words, with appropriate list of words */
    const letterCategory = Object.keys(groupedWords).map(letter => 
          <div id={"category"+letter} key={"category"+letter} className="letter-category">
            <div className="letter-header">{letter}</div>
            {wordsForLetter(groupedWords[letter])}
          </div>
    );

    return (
      <div className="content-block categories-content">
        {letterCategory}
      </div>

    );
  }
}

export default WordList;