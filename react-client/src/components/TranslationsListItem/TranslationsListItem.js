import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';
import './TranslationsListItem.css'

class TranslationsListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        translation: undefined,
        editable: false,

        newTranslation: undefined,
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
              this.props.deleteTranslation(this.state.translation);
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

  render() {
    const translation = this.state.translation;
    
    return this.state.translation ? (

        (this.state.editable) ? (
            <div
                className={this.props.editable ? ("word-translation editable") : ("word-translation") }>
                <div className="translation-category">
                    <input type="text" 
                        className="translation-category translation-input" 
                        defaultValue={(translation.domain || "")}
                        onChange={(event) => this.setTranslationParameter(event, "domain")} />
                    {
                        (this.props.editable) ? (
                            <span>
                                <i className="far fa-check-circle"
                                    onClick={() => this.saveNewTranslationData()}></i>
                                <i className="far fa-times-circle" 
                                    onClick={() => this.toggleEditability()}></i>
                            </span>
                        ) : (null)
                    }
                </div>
                <input 
                    className="original-word translation-header translation-input" 
                    defaultValue={(this.state.translation.word || "")}
                    onChange={(event) => this.setTranslationParameter(event, "word")} />
                <input 
                    className="translated-word translation-header translation-input" 
                    defaultValue={(translation.wordTranslation || "")}
                    onChange={(event) => this.setTranslationParameter(event, "wordTranslation")} />
                <textarea 
                    className="original-word translation-textarea" 
                    defaultValue={(translation.exampleTranslation || "")}
                    onChange={(event) => this.setTranslationParameter(event, "exampleTranslation")} />
                <textarea 
                    className="translated-word translation-textarea" 
                    defaultValue={(translation.example || "")}
                    onChange={(event) => this.setTranslationParameter(event, "example")} />
            </div>
        ) : (
            <div
                className={this.props.editable ? ("word-translation editable") : ("word-translation") }>
                <div className="translation-category">
                    {this.props.index + 1}. {translation.domain}
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
