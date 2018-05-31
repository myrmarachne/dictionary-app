import React, { Component } from 'react';
import { connect } from 'react-redux';
import configuration from '../../configuration';
import fetch from 'cross-fetch';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hardWords: undefined,
      hardWordsLoading: false,
      hardWordsLoadError: null,
      lastWords: undefined,
      lastWordsLoading: false,
      lastWordsLoadError: null,
    }
  }

  componentDidMount() {
    this.loadHardWords();
    this.loadLastWords();
  }

  loadHardWords() {
    this.setState({
      hardWords: undefined,
      hardWordsLoading: true,
      hardWordsLoadError: null,
    })
    fetch(configuration.backendUrl + '/words?type=hard&limit=10')
      .then(response => response.json())
      .then(ids => Promise.all(ids.map(id =>
        fetch(configuration.backendUrl + '/words/' + id)
          .then(response => response.json())
      )))
      .then(hardWords => {
        this.setState({
          hardWords,
          hardWordsLoading: false,
          hardWordsLoadError: null,
        })
      })
      .catch((error) => {
        this.setState({
          hardWords: undefined,
          hardWordsLoading: false,
          hardWordsLoadError: error,
        })
      });
  }

  resetHardWords() {
    this.setState({
      ...this.state,
      hardWords: undefined,
    })
  }

  loadLastWords() {
    this.setState({
      lastWords: undefined,
      lastWordsLoading: true,
      lastWordsLoadError: null,
    })
    fetch(configuration.backendUrl + '/words?type=last&limit=10')
      .then(response => response.json())
      .then(ids => Promise.all(ids.map(id =>
        fetch(configuration.backendUrl + '/words/' + id)
          .then(response => response.json())
      )))
      .then(lastWords => {
        this.setState({
          lastWords,
          lastWordsLoading: false,
          lastWordsLoadError: null,
        })
      })
      .catch((error) => {
        this.setState({
          lastWords: undefined,
          lastWordsLoading: false,
          lastWordsLoadError: error,
        })
      });
  }

  render() {
    const hardWordsList = (this.state.hardWords || []).map(word =>
      <li key={word.id}>{word.word}</li>
    );
    const lastWordsList = (this.state.lastWords || []).map(word =>
      <li key={word.id}>{word.word}</li>
    );

    return (
      <div className="Home">
        <h1>Ostatnio dodane słówka:</h1>
        {this.state.lastWords ? (
          <ul>
            {lastWordsList}
          </ul>
        ) : (
          <p>Ładowanie ostatnio dodanych słówek...</p>
        )}
        
        <h1>Trudne słówka:</h1>
        {this.state.hardWords ? (
          <ul>
            {hardWordsList}
          </ul>
        ) : (
          <p>Ładowanie trudnych słówek...</p>
        )}
        <button onClick={() => this.resetHardWords()}>Reset</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories,
});

export default connect(mapStateToProps)(Home);
