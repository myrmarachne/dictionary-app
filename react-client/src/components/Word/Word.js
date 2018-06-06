import React, { Component } from 'react';
import TranslationsList from '../TranslationsList/TranslationsList';
import configuration from '../../configuration';
import fetch from 'cross-fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createCategory, updateCategory, deleteCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';
import './Word.css' 

class Word extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: undefined,
      wordLoading: false,
      wordLoadError: null,

      addCategoryInputVisible: false,
      newCategoryName: '',
      categories: undefined,
    }
  }

  static getDerivedStateFromProps(props, state){

    const newState = {};
    
    if (props.categories.categories !== state.categories){
      newState.categories = props.categories.categories;
      console.log("E");
    }

    return newState;
  }

  componentDidMount() {
    this.loadWord();
  }

  loadWord() {
    this.setState({
      ...this.state,
      word: undefined,
      wordLoading: true,
      wordLoadError: null,
    })
    fetch(configuration.backendUrl + '/words/' + this.props.match.params.wordId)
      .then(response => response.json())
      .then(word => {
        this.setState({
          word,
          wordLoading: false,
          wordLoadError: null,
        })
      })
      .catch((error) => {
        this.setState({
          word: undefined,
          wordLoading: false,
          wordLoadError: error,
        })
      });
  }

  createTranslation(translation) {
    return fetch(configuration.backendUrl + '/word-translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(translation),
    })
    .then(response => response.json())
    .then(translation => {
      this.setState({
        word: Object.assign({}, this.state.word, { translations: [...this.state.word.translations, translation.id] })
      });
      return translation;
    });
  }

  updateTranslation(translation) {
    return fetch(configuration.backendUrl + '/word-translations/' + translation.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(translation),
    })
    .then(response => response.json());
  }

  
  deleteTranslation(translation) {
    const translations = this.state.word.translations
      .filter(id => id !== translation.id);
    const word = Object.assign({}, this.state.word, { translations });
    return fetch(configuration.backendUrl + '/words/' + this.state.word.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word),
    })
    .then(() => {
      this.setState({
        word,
      });
    });
  }

  updateWord(word){
    return fetch(configuration.backendUrl + '/words/' + word.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    })
    .then(response => response.json());    
  }

  setNameOfNewCategory(event) {
    this.setState({newCategoryName : event.target.value});        
}

toggleNewCategoryInput(){
    this.setState({
        addCategoryInputVisible : !this.state.addCategoryInputVisible,
        newCategoryName: ''
    });
}

deleteWordFromCategory(categoryId){
  const newWord = Object.assign({}, this.state.word);
  newWord.categories = this.state.word.categories.filter(cid => cid != categoryId);

  this.updateWord(newWord);
}

createCategory(event){

    if (event.key === "Enter" && this.state.newCategoryName.length > 0){
        
      /* Check if category with the provided name already exists, and if not - 
      create it and add the word to it */

        const category = (Object.values(this.props.categories.categories).find(c => 
          c.name.toUpperCase() == this.state.newCategoryName.toUpperCase()));
        
        const nameOfCategory = this.state.newCategoryName;

        if (category == null){
          this.props.createCategory({
            name: nameOfCategory,
          }).then(() => {

            const category = (Object.values(this.props.categories.categories).find(c => 
              c.name.toUpperCase() == nameOfCategory.toUpperCase()));
            
            const newCategory = Object.assign({}, category);

            if (newCategory.words.indexOf(this.state.word.id) < 0)
              newCategory.words.push(this.state.word.id);
  
            this.props.updateCategory(newCategory);
            
          });
          
         // TODO
        } else {

          const newCategory = Object.assign({}, category);

          if (newCategory.words.indexOf(this.state.word.id) < 0)
            newCategory.words.push(this.state.word.id);

          this.props.updateCategory(newCategory);
          
        }

        this.setState({
          addCategoryInputVisible: false,
          newCategoryName: ''              
        });

    } else if (event.key === "Escape") {
        this.setState({
            addCategoryInputVisible: false,
            newCategoryName: ''              
          });
    }
}

  render() {
    if (this.state.word) {
      const categories = (this.state.word.categories || []).map(categoryId => {

          const category = (this.props.categories.categories || []).find(category =>
            (category.id === categoryId)
          );

          if (category){
            return (
              <li key={category.id} className="panel-item categories-item">
              <Link className="category-link" to={`/category/${category.id}`}>
                <span className="category-text">
                {(category) ? category.name : null}
                </span>
              </Link><i onClick={() => this.deleteWordFromCategory(category.id)} className="far fa-trash-alt"></i>
            </li>
            );
          } else return null;     
        });

      const categoryAddInput = this.state.addCategoryInputVisible ? (
        <li className="panel-item categories-item">
            <input type="text" value={this.state.newCategoryName}
                onChange = {(event) => this.setNameOfNewCategory(event)}
                onKeyUp = {(event) => this.createCategory(event)}
                autoFocus
                className="category-link category-search" placeholder="Nowa kategoria" />
        </li>
      ) : (null);

      const rightPanel = (        
        <div className="right-panel">
          <div className="black-box upper-box">
            <div className="upper-part"><span className="fancy-text">Kategorie słówka</span>
            <i className="fas fa-plus add-icon" onClick={(event) => this.toggleNewCategoryInput()}></i></div>
              <div className="bottom-part">
                <ul className="categories">
                  {categoryAddInput}
                  {categories}
                </ul>
              </div>
            </div>
        </div>
      );

      return (
        <div className="word">
          {rightPanel}
        </div>
      );

    } else {
        return (
          <p>Ładowanie słówka...</p>
        );
      }
    }
  }

const mapStateToProps = state => ({
  categories: state.categories,
});

const mapDispatchToProps = dispatch =>
bindActionCreators({
  createCategory,
  updateCategory,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Word);

/*            <h1>{this.state.word.word}</h1>
            <TranslationsList
              word={this.state.word}
              createTranslation={(t) => this.createTranslation(t)}
              updateTranslation={(t) => this.updateTranslation(t)}
              deleteTranslation={(t) => this.deleteTranslation(t)} />*/