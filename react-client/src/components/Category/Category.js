import React, { Component } from 'react';
import { connect } from 'react-redux';

import WordsList from '../WordsList/WordsList';
import { bindActionCreators } from 'redux';
import { deleteCategory, updateCategory } from '../../modules/categories';
import './Category.css' 

class Category extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categoryNotFound: false,
      categoryEditable : false,
      categoryName : undefined,
      selectedWords : undefined,
      activeLetters : [],
      wordsFilter : "",
      visibleWords : undefined
    }

    console.log("A");

  }

  static getDerivedStateFromProps(props, state) {

    const newState = {};

    /* Search for category in store */
    const categories = props.categories.categories;
    
    if (props.categories.categories) {

      const category = categories
        .filter(c => String(c.id) === props.match.params.categoryId)[0];

      if (category) {

        newState.category = category;
        newState.categoryName = category.name;
        
        /* Refresh the "selected (checked) words" counter on categories change */
        
        if (state.selectedWords == null || state.category !== category){

          newState.selectedWords = category.words.reduce(function(acc, item){
            acc[item] = true;
            return acc;
          }, {});
        }

        if (state.visibleWords == null || state.category !== category){
          newState.visibleWords = category.words;
        }

        /* Clear the input for searching in category, after catergory change */
        if (state.category !== category){
          newState.wordsFilter = "";
          newState.categoryEditable = false;
        }

      } else{
        newState.categoryNotFound = true;
      }
    }
    return newState;
  }

  deleteCategory() {
    /* Delete current category */
    this.props.deleteCategory(this.state.category);    

    /* Navigate to home page */
    // TODO: Some information box "category succesfully deleted"
    window.location = '/';
  }

  selectAllWords(){
    /* Select (check) all words, that are currently visible and
    leave the not visible words without any change */

    const value = true;

    var selectedWords = Object.keys(this.state.selectedWords).map(Number).reduce(
      function(acc, item){
        acc[item] = (this.state.visibleWords.indexOf(item) > -1) ? 
          value : this.state.selectedWords[item];

        return acc;
      }.bind(this), {});

    this.setState({
      selectedWords,
    });
  }

  toggleCategoryNameEditability(){
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

  deleteWord(word) {
    const category = Object.assign({}, this.state.category);
    category.words = category.words.filter(wordId => wordId !== word.id);
    return this.props.updateCategory(category);
  }

  handleWordSelection(word, value) {
    var selectedWords = Object.assign({}, this.state.selectedWords);
    selectedWords[word.id] = value;

    this.setState({
      selectedWords,
    });
  }

  setActiveletters(activeLetters){
    if (activeLetters !== this.state.activeLetters){
      this.setState({
        activeLetters,
      });
    }
  }

  setVisibleWords(visibleWords){
    if(visibleWords !== this.state.visibleWords){
      this.setState({
        visibleWords,
      })
    }
  }

  filterWords(event){
    this.setState({
      wordsFilter : event.target.value
    });
  }

  render() {

    const categoryName = (this.state.categoryName) ? this.state.categoryName.toUpperCase() : "Ładowanie kategorii";
    
    const categoryNameEdit = (this.state.categoryEditable) ? (
      <input type="text" className="panel-title editable"
        defaultValue={categoryName} autoFocus
        onChange = {(event) => this.setCategoryName(event)}
        onKeyUp={(event) => this.updateCategoryName(event)} />
    ) : (categoryName);

    document.title = categoryName;

    const rightPanel = (
      <div className="right-panel">
                <div className="black-box upper-box">
                    <div className="box-title">Ucz się!</div>
                    <div className="upper-part">Opanowałeś ten dział w  <span className="fancy-text">58%</span></div>
                    <div className="bottom-part">
                        <div className="black-box-text">Wybierz słówka i przejdź do ćwiczeń, aby poprawić swój wynik</div>
                    </div>
                    <a className="fancy-button not-selectable" href="#">Przejdź do ćwiczeń<i className="fas fa-play-circle"></i></a>
                </div>
            </div>
    );

    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

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

    return (
      
      <div className="category">

      {rightPanel}

      <div className="content"> 

          <div className="top-panel">
              <h1 className="panel-title editable">
                {categoryNameEdit}
                <i onClick={() => this.toggleCategoryNameEditability()} className="fas fa-pencil-alt pencil-icon"></i>
                <i onClick={() => this.deleteCategory()} className="far fa-trash-alt"></i>
              </h1>
              <ul className="panel-actions">
                  <li className="content-panel-item">Dodaj słówka</li>                      
                  <li className="content-panel-item">Usuń słówka</li>
              </ul>
              <ul className="letter-index">
                {letterIndex}
              </ul>

                <div className="search-input">
                    <input tpe="text" className="main-search"
                      value={this.state.wordsFilter}      
                      onChange={(event) => this.filterWords(event)}
                      placeholder="Szukaj słówka w kategorii..." />

                    <i className="fas fa-search search-icon"></i>
                </div>

                <div className="select-words">
                    <button onClick={() => this.selectAllWords()}
                    className="select-words-text select-words-button">
                      Wybierz wszystkie
                    </button><button className="select-words-arrow select-words-button"></button>
                    <div className="number-of-selected-words">Wybrano: {
                      
                      (this.state.visibleWords || []).reduce(function(acc, key){
                        return acc + ((this.state.selectedWords[key]) ? 1 : 0);
                      }.bind(this), 0)

                      }
                      </div>
                    <ul className="select-words-menu">
                        <li className="menu-item ">Wybierz wszystkie</li>
                        <li className="menu-item">Wybierz trudne</li>
                    </ul>
                </div>              
          </div>

          {this.state.category ? (
            <WordsList 
                category={this.state.category}
                filter={this.state.wordsFilter}
                deleteWord={(word) => this.deleteWord(word)}
                checkedWords={this.state.selectedWords}
                setVisibleWords={words => this.setVisibleWords(words)}
                selectWords={(word, value) => this.handleWordSelection(word, value)} 
                setActiveletters={(letters) => this.setActiveletters(letters)} />
            ) : (null)}

      </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    updateCategory,
    deleteCategory,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Category);
