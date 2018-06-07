import React, { Component } from 'react';
import TranslationsList from '../TranslationsList/TranslationsList';
import configuration from '../../configuration';
import fetch from 'cross-fetch';
import { Link } from 'react-router-dom';
import './Word.css' 
import WordsCategories from '../WordsCategories/WordsCategories';

import { connect } from 'react-redux';

import { createCategory, updateCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';

class Word extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: undefined,
      wordLoading: false,
      wordLoadError: null,
    }
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




  render() {
    if (this.state.word) {
      return (
        <div className="word">
          <WordsCategories word={this.state.word} />
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
    updateCategory,
    }, dispatch);

  export default connect(mapStateToProps, mapDispatchToProps)(Word);

/*            <h1>{this.state.word.word}</h1>
            <TranslationsList
              word={this.state.word}
              createTranslation={(t) => this.createTranslation(t)}
              updateTranslation={(t) => this.updateTranslation(t)}
              deleteTranslation={(t) => this.deleteTranslation(t)} />*/