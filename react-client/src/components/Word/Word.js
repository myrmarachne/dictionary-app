import React, { Component } from 'react';
import TranslationsList from '../TranslationsList/TranslationsList';
import configuration from '../../configuration';
import fetch from 'cross-fetch';
import { Link } from 'react-router-dom';
import './Word.css' 
import WordsCategories from '../WordsCategories/WordsCategories';
import EditableImage from '../EditableImage/EditableImage';
import WordDescriptions from '../WordDescriptions/WordDescriptions';
import { connect } from 'react-redux';

import { createCategory, updateCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';
import Tooltip from '../Tooltip/Tooltip';

 
class Word extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: undefined,
      wordLoading: false,
      wordLoadError: null,
      categories : undefined,

      wordnameEditable: false,
      deleteTooltip: true
    }
  }

  componentDidMount() {
    this.loadWord();
  }

  static getDerivedStateFromProps(props, state){

    const newState = {};
    
    if (props.categories.categories !== state.categories){
      newState.categories = props.categories.categories;

    /* Make the name uneditable after switching word */
      newState.wordnameEditable = false;
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (this.state.word && (this.props.match.params.wordId != this.state.word.id)){
      this.loadWord();
    }
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


  toggleWordNameEditability(){
    /* Toggle the editability of the word name after clicking
    on the edit icon */
    this.setState({
      wordnameEditable : !this.state.wordnameEditable
    });
  }

  setWordName(event){
    const word = this.state.word;
    word.word = event.target.value.toUpperCase();
    this.setState({
      word
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
    .then(response => response.json())
    .then(() => this.setState({
      word,
    }));
  }

  updateWordName(event) {
    /* Change the name of the word after clicking enter */
    if (event.key === "Enter" && this.state.word && this.state.word.word.length > 0){
      this.updateWord(Object.assign({}, this.state.word, {word: event.target.value}));
      this.setState({
        wordnameEditable : false,
      });

    } else if (event.key === "Escape"){
      this.setState({
        wordnameEditable : false
      });
    }
  }

  deleteWord(word) {
    return fetch(configuration.backendUrl + '/words/' + word.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    })
    .then(response => response.json())
    .then(() => 
      /* Navigate to home page */
      window.location = '/'
    );
  }

  changePhoto(link){
    const word = Object.assign({}, this.state.word);
    word.imageUrl = link;

    this.updateWord(word);
  }

  toggleDeleteTooltip(){
    this.setState({
      deleteTooltip: !this.state.deleteTooltip
    });
  }


  render() {
    if (this.state.word) {

      const wordName = (this.state.word) ? (this.state.word.word || "").toUpperCase() : "Ładowanie słówka";
    
      /* Input for editing word name */
      const wordNameEdit = (this.state.wordnameEditable) ? (
        <input type="text" className="panel-title editable"
          defaultValue={wordName} autoFocus
          onChange = {(event) => this.setWordName(event)}
          onKeyUp={(event) => this.updateWordName(event)} />
      ) : (
        <div className="panel-title-text">{wordName}</div>);
  
      document.title = wordName;

      return (
        <div className="word">
          <WordsCategories word={this.state.word} />

          <div className="content">
            <div className="top-panel">

              <h1 className="panel-title editable">
                {wordNameEdit}
                <i onClick={() => this.toggleWordNameEditability()} className="fas fa-pencil-alt pencil-icon"></i>    
                <i onClick={() => this.toggleDeleteTooltip()} className="far fa-trash-alt">
                  <Tooltip
                    text="Czy na pewno chcesz trwale usunąć to słówko?"
                    yes={() => this.deleteWord(this.state.word)}
                    hide={this.state.deleteTooltip}
                    no={() => this.toggleDeleteTooltip()} />
                </i>
              </h1>
              <ul className="panel-actions"></ul>
            </div>

            <div className="word-content content-block">
        
                <EditableImage word={this.state.word}
                  changePhoto={(link) => this.changePhoto(link)} />
              
                <WordDescriptions word={this.state.word} />

            </div>
          </div>
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

export default connect(mapStateToProps)(Word);
