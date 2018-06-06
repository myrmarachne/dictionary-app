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
      isMounted: false,
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    this.loadTranslations();
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
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
      if (this.state.isMounted) {
        this.setState({
          translations,
          translationsLoading: false,
          translationsLoadError: null,
        });
      }
    })
    .catch((error) => {
      if (this.state.isMounted) {
        this.setState({
          translations: undefined,
          translationsLoading: false,
          translationsLoadError: error,
        });
      }
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
    <div className="word-descriptions">
        {this.state.translations.map((translation, index) => {
          return (
            <div key={translation.id} className="word-translation">
              <div className="translation-category">{index + 1}. {translation.domain}</div>
              <div className="original-word translation-header">{translation.word}</div>
              <div className="translated-word translation-header">{translation.wordTranslation}</div>
              <div className="original-word">{translation.exampleTranslation}</div>
              <div className="translated-word">{translation.example}</div>
            </div>

          );
        })}
    </div>
    ) : (
        <p>Ładowanie translacji...</p>
    );
  }
}

export default TranslationsList;
// {this.props.deleteTranslation && <button onClick={() => this.deleteTranslation(translation)}>Delete</button>}