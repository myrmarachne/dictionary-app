import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';
import TranslationsListItem from '../TranslationsListItem/TranslationsListItem';

class TranslationsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      translations: undefined,
      translationsLoading: false,
      translationsLoadError: null,

      newTranslations: [],

      isMounted: false,
      word: undefined,
      translationCounter: 0
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

    newState.translationCounter = state.translationCounter;

    if (props.word != state.word){
        newState.word = props.word;
    }

    const newTranslationsAdded = props.newTranslationsNumber - (state.newTranslations || []).length;
    newState.newTranslations = (state.newTranslations || []);

    if (newTranslationsAdded > 0){

      /* New empty translations should be added to current state */

      for (var i=0; i < newTranslationsAdded; i++){
        newState.translationCounter++;

        const newTranstlation = {
          id: -(newState.translationCounter),
          wordId: props.word.id,
          domain: undefined,
          word: props.word.word,
          wordTranslation: undefined,
          example: undefined,
          exampleTranslation: undefined
        };
        newState.newTranslations.push(newTranstlation);  
      }
    } 

    return newState;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
      if (prevState.word !== this.state.word){
     //    this.loadTranslations();
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

  updateTranslation(translation) {

    /* Check if this translation is a new or existing one */
    const filteredNewTranslations = (this.state.newTranslations || []).filter(t => {
      return translation.id == t.id
    });

    if (filteredNewTranslations.length > 0){
      /* The translation has not been created on the server yet */

      const translations = this.state.translations;

      this.props.createTranslation(translation).then(t => {
        translations.unshift(t)
  
        this.props.deleteNewTranslation();
        const newTranslations = this.state.newTranslations;
        newTranslations.pop();
  
        this.setState({
          newTranslations,
          translations
        });
      });

    } else {
      /* The translation exists already */
      this.props.updateTranslation(translation);
    }
  }

  cancelTranslation(translation){
    /* Check if this translation is a new or existing one */
    const filteredNewTranslations = (this.state.newTranslations || []).filter(t => {
      return translation.id == t.id
    });

    if (filteredNewTranslations.length > 0){
      this.deleteTranslation(translation);
    }
  }

  deleteTranslation(translation){

    if (translation.id < 0){

        /* This is a new translation, still not created on the server */
        this.props.deleteNewTranslation();

        var indexNewTranslations = this.state.newTranslations.indexOf(translation);
        var index = this.state.translations.indexOf(translation);

        if (indexNewTranslations > -1){
          const newTranslations = this.state.newTranslations;
          newTranslations.splice(index, 1);

          this.setState({
            newTranslations
          });
        } 

        if (index > -1){
          const translations = this.state.translations;
          translations.splice(index, 1);
          
          this.setState({
            translations
          })
        }
      
    } else {
      /* It is an existing translation - delete it on server */

      const translations = (this.state.translations || []).filter(t => {
        return translation.id != t.id
      });

      this.setState({
        translations
      }, () => this.props.deleteTranslation(translation));

    }
  }

  render() {

  const sortedTranslations = (this.state.translations || []).sort((a,b) => {
    if (a != null && b != null){
      if (a.id < 0 && b.id > 0) return -1;
      else if (a.id < 0 && b.id < 0 && a.id > b.id) return 1;
      else if (a.id < b.id) return 1;
      else if (a.id > b.id) return -1;
      else return 0;
    }
    else return 0;
  });
  
  const translations = (this.state.newTranslations || []).concat(sortedTranslations);


  return this.state.translations ? (
    <div className="word-descriptions">
        {translations.map((translation, index) => {

            return (
              translation ? (
                <TranslationsListItem
                key={translation.id}
                editable={this.props.editable}
                index={index}
                translation={translation}
                deleteTranslation={(translation) => this.deleteTranslation(translation)}
                updateTranslation={(translation) => this.updateTranslation(translation)}
                cancelTranslation={(translation) => this.cancelTranslation(translation)}
                word={this.state.word.word}
              />
              )  : null
              
            );

        })}
    </div>
    ) : (
        <p>Ładowanie translacji...</p>
    );
  }
}

export default TranslationsList;
