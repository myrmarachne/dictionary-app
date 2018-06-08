import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';

import WordsListItem from '../WordsListItem/WordsListItem';

class WordList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      category: undefined,
      categoryName : undefined,
      categoryEditable : false,

      words: undefined,
      wordsLoading: false,
      wordsLoadError: null,

      selectedWords : undefined,
      activeLetters : [],
      wordsFilter : "",
      visibleWords : undefined,
      hardWords : undefined,

      dropdownVisible : false

    }

    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
  }

  componentDidMount() {
    if(this.props.category)//todo change it for a cleaner look
      this.loadWords(this.props.category);
  }

  static getDerivedStateFromProps(props, state) {

    const newState = {};

    if(props.category !== state.category){
      newState.category = props.category;
      newState.categoryName = props.category.name;

      /* Clear the input for searching in category, after catergory change */
      newState.wordsFilter = "";
      /* Make the name uneditable after switching category */
      newState.categoryEditable = false;
    }

    if (props.category){
      if (state.selectedWords == null || state.category !== props.category){

        newState.selectedWords = props.category.words.reduce(function(acc, item){
          acc[item] = true;
          return acc;
        }, {});
      }

      if (state.visibleWords == null || state.category !== props.category){
        newState.visibleWords = props.category.words;
      }
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevProps.category !== this.props.category) {
      this.loadWords(this.props.category);
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
      }, () => {
        this.updateHardWords(words);
        this.updateVisibleWords(words);
        this.updateLetterIndex(words);
      });
      

    })
    .catch((error) => {
      this.setState({
        words: undefined,
        wordsLoading: false,
        wordsLoadError: error,
      })
    });

  }

  toggleCategoryNameEditability(){
    /* Toggle the editability of the category name after clicking
    on the edit icon */
    this.setState({
      categoryEditable : !this.state.categoryEditable
    });
  }

  setCategoryName(event){
    this.setState({
      categoryName : event.target.value
    });
  }

  updateCategoryName(event) {
    /* Change the name of the category after clicking enter */
    if (event.key === "Enter" && this.state.categoryName.length > 0){
      this.props.updateCategory(Object.assign({}, this.state.category, {name: event.target.value}));
      this.setState({
        categoryEditable : false,
      });

    } else if (event.key === "Escape"){
      this.setState({
        categoryEditable : false
      });
    }
  }


  updateLetterIndex(words){
    /* Update the active letters in the index */
    const groupedWords = this.groupByFirstLetter(words || []);
    const activeLetters = Object.keys(groupedWords);

    this.setState({
      activeLetters,
    });
    
  }

  updateVisibleWords(words){
    /* Update the array of words, which are visible after filtering */
    const visibleWords = (words || []).map(word => word.id);

    this.setState({
      visibleWords,
    });
    
  }

  updateHardWords(words){
    /* Update the array of hard words, which are visible after filtering */    
    const hardWordsList = (words || []).filter(word => (word.learnedTime == null));
    const hardWords = hardWordsList.map(word => word.id);

    this.setState({
      hardWords
    });
    
    /* Set the amount of learned percantage */
    const learnedPercentage = (Object.keys(words).length > 0) ?
      Math.floor((hardWords.length)/(Object.keys(words).length) * 100) : (0);
    this.props.learned(learnedPercentage);
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

  setWordsFilter(event){
    this.setState({
      wordsFilter : event.target.value
    }, () => {

      const filteredList = this.filterWords(this.state.wordsFilter);
      /* update Active Letters Index */
      this.updateLetterIndex(filteredList);

      /* update the Visible Words List */
      this.updateVisibleWords(filteredList);

      /* update the Visible Hard Words List */
      this.updateHardWords(filteredList);
    });
  }

  filterWords(passedFilter){
    /* Find all words that start with the passedFilter value */

    const filter = (passedFilter) ? passedFilter.toUpperCase() : "";
    return (this.state.words || []).filter(
      word => word.word.toUpperCase().startsWith(filter)
    );
  }


  showDropdownMenu(event){
    /* Clicking outside the opened dropdown menu should hide it - 
    add mouse listener to the docuemnt */
    event.preventDefault();
    
    this.setState({
        dropdownVisible : true
      }, () => { document.addEventListener('click', this.hideDropdownMenu);}
    );

  }

  hideDropdownMenu(event){
    this.setState({
        dropdownVisible : false
      }, () => {document.removeEventListener('click', this.hideDropdownMenu);}
    );
  }



  selectAllWords(){
    /* Select (check) all words, that are currently visible and
    leave the not visible words without any change */
    var selectedWords = Object.keys(this.state.selectedWords).map(Number).reduce(
      function(acc, item){
        acc[item] = (this.state.visibleWords.indexOf(item) > -1) ? 
          true : this.state.selectedWords[item];

        return acc;
      }.bind(this), {});

    this.setState({
      selectedWords,
    });
  }

  unSelectAllWords(){
    /* Unselect (uncheck) all words, that are currently visible and
    leave the not visible words without any change */
    var selectedWords = Object.keys(this.state.selectedWords).map(Number).reduce(
      function(acc, item){
        acc[item] = (this.state.visibleWords.indexOf(item) > -1) ? 
          false : this.state.selectedWords[item];

        return acc;
      }.bind(this), {});

    this.setState({
      selectedWords,
    });
  }  

  selectHardWords(){
    /*Selects only the words that are marked as hard from the currently visible
    words, and leaves the rest of words without any change */
    var selectedWords = Object.keys(this.state.selectedWords).map(Number).reduce(
      function(acc, item){
        acc[item] = (this.state.hardWords.indexOf(item) > -1) ? 
          true : this.state.selectedWords[item];

        return acc;
      }.bind(this), {});

    this.setState({
      selectedWords,
    });
  }


  deleteSelected(){
    /* Delete the selected words, which are visible */
    const category = Object.assign({}, this.state.category);
    category.words = category.words.filter(word => 
      (this.state.selectedWords[word]) ? false : true
    );
    return this.props.updateCategory(category);
  }


  handleWordSelection(word, value) {
    var selectedWords = Object.assign({}, this.state.selectedWords);
    selectedWords[word.id] = value;

    this.setState({
      selectedWords,
    });
  }

  render() {


    const categoryName = (this.state.categoryName) ? this.state.categoryName.toUpperCase() : "Ładowanie kategorii";
    
    /* Input for editing category name */
    const categoryNameEdit = (this.state.categoryEditable) ? (
      <input type="text" className="panel-title editable"
        defaultValue={categoryName} autoFocus
        onChange = {(event) => this.setCategoryName(event)}
        onKeyUp={(event) => this.updateCategoryName(event)} />
    ) : (categoryName);

    document.title = categoryName;


    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    /* Index of letters with links to each category beginning */
    const letterIndex = alphabet.map(letter => {
      if (this.state.activeLetters.indexOf(letter) > -1){
        return (
          <li key={letter} className="letter-index-item">
            <a className="letter-index-link" href={`#category`+letter}>{letter}</a>
          </li>
        );
      } else return (
        <li key={letter} className="letter-index-item">
          <a className="letter-index-link deactivated-link" >{letter}</a>
        </li>
      );      
    });

    /* Number of currently selected, visible words*/
    const numberOfSelected =  (this.state.visibleWords || []).reduce(
      function(acc, key){
        return acc + ((this.state.selectedWords[key]) ? 1 : 0);
    }.bind(this), 0);

    /* The button for all words selection */
    const selectButton = (
      <button onClick={() => this.selectAllWords()}
        className="select-words-text select-words-button">
        Zaznacz wszystkie
      </button>
    );

    /* Grouped words, after applying the passed from Category filter */
    const groupedWords = this.groupByFirstLetter(this.filterWords(this.state.wordsFilter));
    
    /* Function which maps words objects into WordsListItem */
    var wordsForLetter = function(wordsList){
      return wordsList.map(word => 
         <WordsListItem key={word.id} word={word} 
          checked={this.state.selectedWords[word.id]}
          selectWords={(word, value) => this.handleWordSelection(word, value)} />
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
      <div className="content"> 

          <div className="top-panel">
              <h1 className="panel-title editable">
                {categoryNameEdit}
                <i onClick={() => this.toggleCategoryNameEditability()} className="fas fa-pencil-alt pencil-icon"></i>
                <i onClick={() => this.props.deleteCategory(this.state.category)} className="far fa-trash-alt"></i>
              </h1>
              <ul className="panel-actions">
                  <li className="content-panel-item">Dodaj słówka</li>                      
                  <li className="content-panel-item" onClick={(event) => this.deleteSelected(event)}>
                    Usuń słówka
                  </li>
              </ul>
              <ul className="letter-index">
                {letterIndex}
              </ul>

                <div className="search-input">
                    <input tpe="text" className="main-search"
                      value={this.state.wordsFilter}      
                      onChange={(event) => this.setWordsFilter(event)}
                      placeholder="Szukaj słówka w kategorii..." />

                    <i className="fas fa-search search-icon"></i>
                </div>

                <div className="select-words">
                    {selectButton}
                    <button className="select-words-arrow select-words-button"
                      onClick={(event) => this.showDropdownMenu(event)}>
                    </button>
                    <div className="number-of-selected-words">Wybrano: {
                      (this.state.category) ? numberOfSelected : null
                      }
                      </div>
                    <ul className={(this.state.dropdownVisible) ? 
                      ("select-words-menu show-menu") : ("select-words-menu")}>
                        <li className="menu-item" onClick={() => this.selectAllWords()}>
                          Zaznacz wszystkie
                        </li>
                        <li className="menu-item" onClick={() => this.selectHardWords()}>
                          Zaznacz trudne
                        </li>
                        <li className="menu-item" onClick={() => this.unSelectAllWords()}>
                          Odznacz wszystkie
                        </li>
                    </ul>
                </div>              
          </div>

          <div className="content-block categories-content">
            {letterCategory}
          </div>

      </div>      
    );
  }
}

export default WordList;