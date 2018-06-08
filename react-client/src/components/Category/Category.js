import React, { Component } from 'react';
import { connect } from 'react-redux';
import configuration from '../../configuration';

import WordsList from '../WordsList/WordsList';
import InformationBox from '../InformationBox/InformationBox';

import { bindActionCreators } from 'redux';
import { deleteCategory, updateCategory } from '../../modules/categories';

import './Category.css' 

class Category extends Component {

  constructor(props) {
    super(props);

    this.state = {
      category: undefined,
      categoryNotFound: false,
      learnedPercentage : 0,
      words: [],
      wordsLoading: false,
      wordsLoadError: null,
    }

  }

  componentDidMount() {
    this.loadWords();
  }

  static getDerivedStateFromProps(props, state) {

    const newState = {};
    console.log(props);

    /* Search for category in store */
    const categories = props.categories.categories;
    
    if (props.categories.categories) {

      const categoryId = props.match.params.categoryId;
      const category = categories
        .filter(c => String(c.id) === categoryId)[0];

      if (category) {
        newState.category = category;

      } else if (categoryId === "all") {
        /* The category with all words */
        newState.words = [];

      } else {
        newState.categoryNotFound = true;
        console.log("elo");

      }
    }
    return newState;
  }


  loadWords() {
    this.setState({
      ...this.state,
      words: undefined,
      wordsLoading: true,
      wordsLoadError: null,
    })
    fetch(configuration.backendUrl + '/words/')
      .then(response => response.json())
      .then(words => {
        this.setState({
          words,
          wordsLoading: false,
          wordsLoadError: null,
        })
      })
      .catch((error) => {
        this.setState({
          words: undefined,
          wordsLoading: false,
          wordsLoadError: error,
        })
      });
  }

  deleteCategory(category) {
    /* Delete current category */
    this.props.deleteCategory(category);    

    /* Navigate to home page */
    // TODO: Some information box "category succesfully deleted"
    window.location = '/';
  }

  setLearnedPercentage(learnedPercentage){
    this.setState({
      learnedPercentage,
    });
  }

  render() {

    /* Texts renderred fot information box */
    const upperPartText = (
      <div>
        Opanowałeś ten dział w <span className="fancy-text">{this.state.learnedPercentage}</span>%
      </div>
    );

    const progressText = (this.state.learnedPercentage == 0) ? (
      <div className="black-box-text">
       Wybierz słówka, od których chcesz rozpocząć naukę i przejdź do ćwiczeń
      </div>
    ) : (
      (this.state.learnedPercentage === 100) ? (
        <div className="black-box-text">
          Opanowałeś już wszystkie słówka z tego działu. Zawsze możesz tu powrócić, powtórzyć czego się już nauczyłeś."
        </div>
      ) : (
        <div className="black-box-text">
          "Wybierz słówka i przejdź do ćwiczeń, aby poprawić swój wynik"
        </div>
      )
    );

    /* Right panel of the page, containing the information box */
    const rightPanel = (
      <div className="right-panel">
        <InformationBox title="Ucz się"
          upperPart={upperPartText}
          bottomPart={progressText} button={`/`}
          buttonText="Przejdź do ćwiczeń" />
      </div>
    );

    return (
      
      <div className="category">

      {rightPanel}

      <WordsList 
        category={this.state.category}
        deleteWord={(word) => this.props.deleteWord(word)}
        updateCategory={(category) => this.props.updateCategory(category)} 
        deleteCategory={(category) => this.deleteCategory(category)}
        learned={(learnedPercentage) => this.setLearnedPercentage(learnedPercentage)}/>
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    updateCategory,
    deleteCategory,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Category);
