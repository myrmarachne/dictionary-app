import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';

class TranslationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translations: undefined,
      translationsLoading: false,
      translationsLoadError: null,
    }
  }

  componentDidMount() {
    this.loadTranslations();
  }

  loadTranslations() {
    this.setState({
      translations: undefined,
      translationsLoading: true,
      translationsLoadError: null,
    })
    Promise.all(this.props.word.translations.map(id =>
      fetch(configuration.backendUrl + '/word-translations/' + id)
        .then(response => response.json())
    ))
    .then(translations => {
      this.setState({
        translations,
        translationsLoading: false,
        translationsLoadError: null,
      })
    })
    .catch((error) => {
      this.setState({
        translations: undefined,
        translationsLoading: false,
        translationsLoadError: error,
      })
    });
  }

  createTranslation(translation) {
    this.props.createTranslation(translation)
      .then(translation => {
        this.setState({
          translations: [translation, ...this.state.translations],
        });
        return translation;
      });
  }

  updateTranslation(translation) {
    this.props.updateTranslation(translation)
      .then(translation => {
        const translations = this.state.translations.slice(0);
        translations[this.state.translations.map(t => t.id).indexOf(translation.id)] = translation;
        this.setState({
          translations,
        })
        return translation;
      });
  }

  deleteTranslation(translation) {
    this.props.deleteTranslation(translation);
    this.setState({
      translations: this.state.translations.filter(t => t !== translation),
    });
  }

  render() {
   return this.state.translations ? (
      <ul className="translations-list">
        {this.state.translations.map((translation, index) => {
          return (
            <li key={translation.id}>
              {index + 1}. {translation.domain}<br />
              {translation.word} - {translation.wordTranslation}<br />
              {translation.example} - {translation.exampleTranslation}
              {this.props.deleteTranslation && <button onClick={() => this.deleteTranslation(translation)}>Delete</button>}
            </li>
          );
        })}
      </ul>
    ) : (
        <p>Ładowanie translacji...</p>
    );
  }
}

export default TranslationsList;
