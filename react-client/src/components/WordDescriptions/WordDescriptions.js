 
 
import React, { Component } from 'react';
import configuration from '../../configuration';
import TranslationsList from '../TranslationsList/TranslationsList';

class WordDescriptions extends Component {

    constructor(props){
        super(props);

        this.state = {
            word: undefined
        };
    }

    static getDerivedStateFromProps(props, state){
        const newState = {};

        if (state.word == null) {
            newState.word = props.word;
        }

        return newState;
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

    render(){
        if(this.state.word){

            return (
                <div>
                    <div className="translations-header">Tłumaczenia<i className="fas fa-plus add-icon"></i></div>

                    <div className="word-descriptions">
                        <TranslationsList word={this.state.word} editable
                         deleteTranslation = {(translation) => this.deleteTranslation(translation)} />                                         
                    </div>

                </div>
            );
        } else return (
            <p>Ładowanie tłumaczeń</p>
        )
    }
}

export default WordDescriptions;