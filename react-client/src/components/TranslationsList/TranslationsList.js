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

    if (state.word == null){
      newState.newTranslationsNumber = 0;
    }

    if (props.word != state.word){
        newState.word = props.word;
    }

    const newTranslationsAdded = props.newTranslationsNumber - (state.newTranslations || []).length;

    if (newTranslationsAdded > 0){

      newState.newTranslations = (state.newTranslations || []);
      /* New empty translations should be added to current state */

      for (var i=0; i < newTranslationsAdded; i++){

        const newTranstlation = {
          id: -(newState.newTranslations.length +1),
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

  updateTranslation(translation) {

    if (translation.id < 0){
      /* The translation has not been created on the server yet */
      this.props.createTranslation(translation);
      this.props.deleteNewTranslation();

      const newTranslations = this.state.newTranslations;
      newTranslations.pop();
      
      this.setState({
        newTranslations
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

      const newTranslations = this.state.newTranslations;
      newTranslations.pop();
      
      this.setState({
        newTranslations
      });

    } else {
      /* It is an existing translation - delete it on server */
      this.props.deleteTranslation(translation);
    }
  }

  render() {

  const sortedTranslations = (this.state.translations || []).sort((a,b) =>{
    if (a.id < b.id) return 1;
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