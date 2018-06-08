import React, { Component } from 'react';
import fetch from 'cross-fetch';
import configuration from '../../configuration';
import './TranslationsListItem.css'

class TranslationsListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      translation: undefined,
      editable: false
    }
  }


  static getDerivedStateFromProps(props, state){
    const newState = {};

    if (props.translation != state.translation){
        newState.translation = props.translation;
    }

    return newState;
  }

  toggleEditability(){
    /* Toggle the editability of the word name after clicking
    on the edit icon */
    this.setState({
      editable : !this.state.editable
    });
  }

  render() {
    const translation = this.state.translation;
    
    return this.state.translation ? (

        (this.state.editable) ? (
            <div 
                className={this.props.editable ? ("word-translation editable") : ("word-translation") }>
                <div className="translation-category">
                    <input type="text" className="translation-category translation-input" 
                        defaultValue={translation.domain} />
                    {
                        (this.props.editable) ? (
                            <span>
                            <i className="far fa-trash-alt"
                                onClick={() => this.props.deleteTranslation(translation)}></i>
                            </span>
                        ) : (null)
                    }
                </div>
                <input className="original-word translation-header translation-input" defaultValue={translation.word} />
                <input className="translated-word translation-header translation-input" defaultValue={translation.wordTranslation} />
                <textarea className="original-word translation-textarea" defaultValue={translation.exampleTranslation} />
                <textarea className="translated-word translation-textarea" defaultValue={translation.example} />
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
