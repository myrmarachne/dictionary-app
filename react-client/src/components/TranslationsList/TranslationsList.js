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
      word: undefined
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    this.loadTranslations();
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  static getDerivedStateFromProps(props, state){
    const newState = {};

    if (props.word != state.word){
        newState.word = props.word;
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
      if (prevState.word !== this.state.word){
         this.loadTranslations();
      }
  }

  loadTranslations() {
    this.setState({
      translations: undefined,
      translationsLoading: true,
      translationsLoadError: null,
    })
    Promise.all(this.state.word.translations.map(id =>
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

  render() {
   return this.state.translations ? (
    <div className="word-descriptions">
        {this.state.translations.map((translation, index) => {
          if (translation)
            return (
              <div key={translation.id} 
                className={this.props.editable ? ("word-translation editable") : ("word-translation") }>
                <div className="translation-category">
                  {index + 1}. {translation.domain}
                  {
                    (this.props.editable) ? (
                      <span>
                        <i className="fas fa-pencil-alt pencil-icon"></i>
                        <i className="far fa-trash-alt"
                          onClick={() => this.props.deleteTranslation(translation)}></i>
                      </span>
                    ) : (null)
                  }
                </div>
                <div className="original-word translation-header">{translation.word}</div>
                <div className="translated-word translation-header">{translation.wordTranslation}</div>
                <div className="original-word">{translation.exampleTranslation}</div>
                <div className="translated-word">{translation.example}</div>
              </div>

            );
          else return null;
        })}
    </div>
    ) : (
        <p>Ładowanie translacji...</p>
    );
  }
}

export default TranslationsList;
// {this.props.deleteTranslation && <button onClick={() => this.deleteTranslation(translation)}>Delete</button>}