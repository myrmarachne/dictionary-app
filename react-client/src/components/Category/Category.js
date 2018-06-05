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
      selectedWords : undefined,
      activeLetters : []
    }

  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    // search for category in store
    const categories = props.categories.categories;
    if (props.categories.categories) {
      const category = categories
        .filter(c => String(c.id) === props.match.params.categoryId)[0];
      if (category) {
        newState.category = category;

        // Refresh the "selected words" counter on categories change
        if (state.selectedWords == null || state.category !== category){
          newState.selectedWords = category.words.reduce(function(acc, item){
            acc[item] = true;
            return acc;
          }, {});

        }
      } else{
        newState.categoryNotFound = true;
      }
    }
    return newState;
  }

  deleteCategory() {
    this.props.deleteCategory(this.state.category);    
    // Navigate to home page
    // TODO: Some information box "category succesfully deleted"
    window.location = '/';
  }

  editCategoryName(){
    this.setState({
      categoryEditable : !this.state.categoryEditable
    });
  }

  updateCategoryName(event) {
    if (event.key === "Enter" && event.target.value.length > 0){
      this.props.updateCategory(Object.assign({}, this.state.category, {name: event.target.value}));
      this.setState({
        categoryEditable : false
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

  render() {

    const categoryName = (this.state.category) ? this.state.category.name.toUpperCase() : "Ładowanie kategorii";
    const categoryNameEdit = (this.state.categoryEditable) ? (
      <input type="text" className="panel-title editable"
        defaultValue={categoryName} autoFocus
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

    console.log(this.state.selectedWords);
    return (
      
      <div className="category">

      {rightPanel}

      <div className="content"> 


          <div className="top-panel">
              <h1 className="panel-title editable">
                {categoryNameEdit}
                <i onClick={() => this.editCategoryName()} className="fas fa-pencil-alt pencil-icon"></i>
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
                    <input tpe="text" className="main-search" placeholder="Szukaj słówka w kategorii..." />
                    <i className="fas fa-search search-icon"></i>
                </div>

                <div className="select-words">
                    <button className="select-words-text select-words-button">
                      Zaznacz wszystkie
                    </button><button className="select-words-arrow select-words-button"></button>
                    <div className="number-of-selected-words">Wybrano: {
                      
                      Object.keys(this.state.selectedWords || {}).reduce(function(acc, key){
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
                deleteWord={(word) => this.deleteWord(word)}
                checkedWords={this.state.selectedWords}
                selectWords={(word, value) => this.handleWordSelection(word, value)} 
                setActiveletters={(letters) => this.setActiveletters(letters)} />
            ) : (null)}

      </div>
      {/*
        {this.state.category ? (
          <div>
            <h1>{this.state.category.name}</h1>
            <button onClick={() => this.deleteCategory()}>Delete</button>
            <button onClick={() => this.updateDemo()}>test update</button>
            <WordsList
              category={this.state.category}
              deleteWord={(word) => this.deleteWord(word)} />
          </div>
         ) : (
          <p>Ładowanie kategorii...</p>
        )}*/}
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
