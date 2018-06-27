import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';
import './TranslationsListItem.css'
import TextInput from '../TextInput/TextInput'

class TranslationsListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        translation: undefined,
        editable: false,

        newTranslation: undefined,

        domainValidity: false,
        wordTranslationValidity: false,
        wordValidity: false
    }
  }

  static getDerivedStateFromProps(props, state){

    if (state.translation == null){
        const newState = {};

        if (props.translation != null){
            /* Already existing translation */
            newState.translation = props.translation;
            newState.newTranslation = props.translation;
        }
           
        if(props.translation.id < 0){
            newState.editable = true;
        }
        
        return newState;
    } else 
        return null;
  }

  toggleEditability(){
    /* Toggle the editability of the word name after clicking
    on the edit icon */
    if (!this.state.editable){
        const newTranslation = Object.assign({}, this.state.translation);

        this.setState({
            editable : !this.state.editable,
            newTranslation,
          });

    } else {
        this.setState({
            editable : !this.state.editable,
          }, () => {
              if (this.state.translation.id < 0)
                this.props.cancelTranslation(this.state.translation);
          });
    }
  }

  setTranslationParameter(event, parameter){

      const translation = Object.assign({}, this.state.newTranslation);
      translation[parameter] = event.target.value;

      this.setState({
        newTranslation: translation,
      });
  }

  saveNewTranslationData(){

    this.setState({
        editable: false,
        translation: this.state.newTranslation
    }, () => {
        this.props.updateTranslation(this.state.translation);
    });
  }

  setDomainValidity(value){
    this.setState({
        domainValidity : value,
    });
  }

  setWordValidity(value){
    this.setState({
        wordValidity : value,
    });
  }

  setWordTranslationValidity(value){
    this.setState({
        wordTranslationValidity : value,
    });
  }


  render() {
    const translation = this.state.translation;
    const validity = this.state.wordValidity && this.state.wordTranslationValidity && this.state.domainValidity;

    return this.state.translation ? (

        (this.state.editable) ? (
            <div
                className={this.props.editable ? ("word-translation editable") : ("word-translation") }>
                <div className="translation-category">
                    <TextInput
                        placeholder="Dziedzina"
                        className="translation-category translation-input" 
                        defaultValue={(translation.domain || "")}
                        setTranslationParameter={(event) => this.setTranslationParameter(event, "domain")} 
                        validate={(value) => this.setDomainValidity(value)} />
                    {
                        (this.props.editable) ? (
                            <span>
                        
                                <i className={(validity) ? ("far fa-check-circle") : ("far fa-check-circle disabled")}
                                    onClick={() => this.saveNewTranslationData()}></i>

                                <i className="far fa-times-circle" 
                                    onClick={() => this.toggleEditability()}></i>
                            </span>
                        ) : (null)
                    }
                </div>
                <TextInput
                    placeholder="Słowo"
                    className="original-word translation-header translation-input" 
                    defaultValue={(this.state.translation.word || "")}
                    setTranslationParameter={(event) => this.setTranslationParameter(event, "word")}
                    validate={(value) => this.setWordValidity(value)} />
                <TextInput 
                    placeholder="Tłumaczenie słowa"
                    className="translated-word translation-header translation-input" 
                    defaultValue={(translation.wordTranslation || "")}
                    setTranslationParameter={(event) => this.setTranslationParameter(event, "wordTranslation")} 
                    validate={(value) => this.setWordTranslationValidity(value)} />
                <textarea 
                    placeholder="Przykład użycia"
                    className="original-word translation-textarea" 
                    defaultValue={(translation.exampleTranslation || "")}
                    onChange={(event) => this.setTranslationParameter(event, "exampleTranslation")} />
                <textarea 
                    placeholder="Tłumaczenie przykładu użycia"
                    className="translated-word translation-textarea" 
                    defaultValue={(translation.example || "")}
                    onChange={(event) => this.setTranslationParameter(event, "example")} />
            </div>
        ) : (
            <div
                className={this.props.editable ? ("word-translation editable") : ("word-translation") }>
                <div className="translation-category">
                    <div className="translation-category-text">{this.props.index + 1 + "." + String.fromCharCode(160)}{translation.domain}</div>
                    {
                        (this.props.editable) ? (
                            <span>
                            <i className="fas fa-pencil-alt pencil-icon"
                                onClick={() => this.toggleEditability()}></i>
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
        ) 
         
    ) : (
        <p>Ładowanie...</p>
    );
  }
}

export default TranslationsListItem;
