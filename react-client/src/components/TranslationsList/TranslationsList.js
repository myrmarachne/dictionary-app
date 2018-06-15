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

    if (newTranslationsAdded > 0){

      newState.newTranslations = (state.newTranslations || []);
      /* New empty translations should be added to current state */

      for (var i=0; i < newTranslationsAdded; i++){
        
        newState.translationCounter++;

        const newTranstlation = {
          id: -(newState.translationCounter),
          wordId: props.word.id,
          domain: undefined,
          word: props.word.word.toLowerCase(),
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

    if (translation.id < 0){
      /* The translation has not been created on the server yet */
      this.props.createTranslation(translation);
      this.props.deleteNewTranslation();

      const newTranslations = this.state.newTranslations;
      const translations = this.state.translations;

      newTranslations.pop();
      translations.unshift(translation);

      this.setState({
        newTranslations,
        translations
      });

    } else {
      /* The translation exists already */
      this.props.updateTranslation(translation);
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
      this.props.deleteTranslation(translation);

      var index = this.state.translations.indexOf(translation);
      const translations = this.state.translations;
      translations.splice(index, 1);
      
      this.setState({
        translations
      })

    }
  }

  render() {

  const sortedTranslations = (this.state.translations || []).sort((a,b) => {
    if (a.id < 0 && b.id > 0) return -1;
    else if (a.id < 0 && b.id < 0 && a.id > b.id) return 1;
    else if (a.id < b.id) return 1;
    else if (a.id > b.id) return -1;
    else return 0;
  });
  
  const translations = (this.state.newTranslations || []).concat(sortedTranslations);


  return this.state.translations ? (
    <div className="word-descriptions">
        {translations.map((translation, index) => {

            return (
              
              <TranslationsListItem
                key={translation.id}
                editable={this.props.editable}
                index={index}
                translation={translation}
                deleteTranslation={(translation) => this.deleteTranslation(translation)}
                updateTranslation={(translation) => this.updateTranslation(translation)}
                word={this.state.word.word}
              />
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