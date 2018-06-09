import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import configuration from '../../configuration';
import fetch from 'cross-fetch';
import LearnChart from '../LearnChart/LearnChart';
import { Link } from 'react-router-dom';
import InformationBox from '../InformationBox/InformationBox';

import { loadCategories } from '../../modules/categories';

import './Home.css' 


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
      wordOfTheDay : undefined,
      wordOfTheDayTranslation : undefined
    }
  }

  componentDidMount() {
    this.loadHardWords();
    this.loadLastWords();

    this.loadWordOfTheDay();
    
    document.title = "Strona główna";
  }

  loadWordOfTheDay() {
    this.setState({
      wordOfTheDay : undefined,
      wordOfTheDayTranslation : undefined
    })

    fetch(configuration.backendUrl + '/words')
    .then(response => response.json())
    .then(ids => {
      const index = (new Date()).getDate() % ids.length;
      const randomId = ids[index];
      return fetch(configuration.backendUrl + '/words/' + randomId)
    })
    .then(response => response.json())
    .then(word => {
      this.setState({
        wordOfTheDay: word,
      })
      return fetch(configuration.backendUrl + '/word-translations/' + word.translations[0])
    })
    .then(response => response.json())
    .then(wordTranslation => {
      this.setState({
        wordOfTheDayTranslation : wordTranslation
      })
    }
    ).catch((error) => {
      this.setState({
        wordOfTheDay: null,
        wordOfTheDayTranslation: null
      })
    });


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
      hardWords: [],
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
      <li key={word.id}><Link to={`/words/${word.id}`} className="link-to-word">{word.word}</Link></li>
    );
    const lastWordsList = (this.state.lastWords || []).map(word =>
      <li key={word.id}><Link to={`/words/${word.id}`} className="link-to-word">{word.word}</Link></li>
    );

    /* Information boxes in the right panel */
    /* Word of the day box */

    const wordOfTheDayName = (this.state.wordOfTheDay) ? (
      <span className="fancy-text">{this.state.wordOfTheDay.word}</span>
    ) : ("Ładowanie słówka dnia");

    const pictureWithCaption = (this.state.wordOfTheDay && this.state.wordOfTheDayTranslation) ? (
      <div>
        <div className="black-box-photo">{
          (this.state.wordOfTheDay.imageUrl) ? (
            <img src={this.state.wordOfTheDay.imageUrl} alt={this.state.wordOfTheDay.word}/> 
          ) : (null)
        }
       </div>
        <div className="black-box-text">{this.state.wordOfTheDayTranslation.wordTranslation.toUpperCase()}</div>
      </div>
    ) : ("Ładowanie ilustracji");

    const wordOfTheDayBox = (this.state.wordOfTheDay && this.state.wordOfTheDayTranslation) ? (
      <InformationBox title="Słówko dnia"
      upperPart={wordOfTheDayName}
      bottomPart={pictureWithCaption} 
      button={`/words/${this.state.wordOfTheDay.id}`} buttonText="Przejdź do słówka"
      bottomBox />
    ) : (null);

    /* Last learned category box */

    const lastCategory = (this.props.categories.categories) ? (
      this.props.categories.categories[Math.floor(Math.random() * this.props.categories.categories.length)]
    ) : (null);
    
    const learnedPercentage = (lastCategory) ? (
      (lastCategory.words.length > 0) ? (
        Math.floor((lastCategory.learnedWordsBeforeThisWeek + lastCategory.learnedWordsThisWeek) * 100 / lastCategory.words.length)
      ) : (0)
    ) : (0);

    const upperPart = lastCategory ? ( 
      <div>
        Ostatnio ćwiczyłeś słówka z kategorii <span className="fancy-text">{lastCategory.name}</span>
      </div>
    ) : ("Ładowanie postępu nauki");

    const progressText = (
      <div>
        <div className="black-box-text">Opanowałeś ją już w <b>{learnedPercentage}%</b></div>
        <div className="black-box-text">Przejdź do tej kategorii, aby poprawić swój wynik</div>
      </div>
    );

    const lastLearnedCategory = (lastCategory) ? (
        <InformationBox title="Ucz się"
          upperPart={upperPart}
          bottomPart={progressText} 
          button={`/category/${lastCategory.id}`} buttonText="Przejdź do kategorii" />
    ) : (null);

    const rightPanel = (
    <div className="right-panel">
      {lastLearnedCategory}
      {wordOfTheDayBox}
    </div>
    );

    return (
      <div className="Home">
        {rightPanel}
        <div className="content">
            <div className="top-panel">
                <h1 className="main-page panel-title"><span className="small-letters-title">ad</span>DICT</h1>
                <ul className="panel-actions"></ul>
            </div>

            <div className="statistics-container">
                <div className="words-statistics">
                        <div className="last-added-block content-block">
                            <div className="box-title">Ostatnio dodane</div>

                            {this.state.lastWords ? (
                              <ul className="list-of-words">
                                {lastWordsList}
                              </ul>
                            ) : (
                              <p>Ładowanie ostatnio dodanych słówek...</p>
                            )}
 
                            <Link className="fancy-button not-selectable" to={`/`}>Ćwicz nowe słówka<i className="fas fa-play-circle"></i></Link>
                        </div>

                        <div className="hard-words-block content-block">
                            <div className="box-title">Trudne słówka</div>
                            {this.state.hardWords ? (
                              <ul className="list-of-words">
                                {hardWordsList}
                              </ul>
                            ) : (
                              <p>Ładowanie trudnych słówek...</p>
                            )}
                          <button onClick={() => this.resetHardWords()} className="fancy-button not-selectable">Zresetuj</button>
                        </div>
                </div>
                
                <div className="progress-block content-block">
                    <div className="box-title">Postępy w nauce</div>
                    {this.props.categories.categories ? (
                      <LearnChart categories={this.props.categories.categories} />
                    ) : (
                      <p>Ładowanie kategorii...</p>
                    )}
                </div>

            </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    loadCategories,
  }, dispatch);


export default connect(mapStateToProps)(Home);
