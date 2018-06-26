import React, { Component } from 'react';
import { connect } from 'react-redux';
import configuration from '../../configuration';

import { createCategory, updateCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import './WordsCategories.css' 
import InformationBox from '../InformationBox/InformationBox';
import CategoryAdder from '../CategoryAdder/CategoryAdder';
import PerfectScrollbar from 'react-perfect-scrollbar';


class WordsCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
          word: undefined,
          categories: undefined,
          hintsVisible: false,
        }
      }

    static getDerivedStateFromProps(props, state){

        const newState = {};
        
        if (props.categories.categories !== state.categories){
            newState.categories = props.categories.categories;
        }

        if (props.word !== state.word && state.word == null){
            newState.word = props.word;
        }

        return newState;
    }


    toggleNewCategoryInput(){
        this.setState({
            addCategoryInputVisible : !this.state.addCategoryInputVisible,
            newCategoryName: ''
        });
    }

    deleteWordFromCategory(categoryId, categories){
        const newWord = Object.assign({}, this.state.word);
        const oldCategories = this.state.word.categories;

        newWord.categories = this.state.word.categories.filter(cid => cid !== categoryId);
        this.updateWordCategories(newWord, oldCategories);
    }

    updateWordCategories(word, oldCategories){
        return fetch(configuration.backendUrl + '/words/' + word.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(word),
        })
        .then(response => response.json())
        .then(() =>
          this.setState({
            word,
          }, () => {

            const categories = (oldCategories || [])
                .filter(x => !word.categories.includes(x))
                .concat(word.categories.filter(x => !(oldCategories || []).includes(x)));

            (categories || []).map(categoryId => {
            
                const category = (this.state.categories || []).find(category =>
                    (category.id === categoryId));

                const categoryInWordIndex = word.categories.indexOf(categoryId);
                const wordInCategoryIndex = (category || []).words.indexOf(word.id);

                if (wordInCategoryIndex < 0 && categoryInWordIndex > -1)
                    category.words.push(word.id);
                else if (wordInCategoryIndex > -1 && categoryInWordIndex < 0)
                    category.words.splice(wordInCategoryIndex, 1);

                this.props.updateCategory(category, false);
            })
          })
        );
      }


    setNameOfNewCategory(event) {
        this.setState({
            newCategoryName : event.target.value
        });        
    }

    setHintsVisibility(hintsVisible){
        this.setState({
            hintsVisible,
        });
    }

    
    render(){        
        
        /* If the input for category adding is not visible - show the categories, this word 
        is belonging to. If it is visible - hide the assigned categories list, and show 
        list of categories suggestions instead */

        /* Map the list of categories assign to this word to a styled list */
        const categories = (this.state.word.categories || []).map(categoryId => {
            
            const category = (this.state.categories || []).find(category =>
            (category.id === categoryId)
            );

            if (category){
            return (
                <li key={category.id} className="panel-item categories-item">
                <Link className="category-link" to={`/category/${category.id}`}>
                <span className="category-text">
                {(category) ? category.name : null}
                </span>
                </Link><i onClick={() => this.deleteWordFromCategory(category.id)} className="far fa-trash-alt"></i>
            </li>
            );
            } else return null;     
        });


        /* Part of Information Box, that would be renderred*/
        /* The header of categories with the 'add category' icon */
        /* The list of all categories assigned to this particular word */
        const bottomPart = (
            <div>
                <CategoryAdder word={this.state.word}
                    updateWordCategories={(word) => this.updateWordCategories(word)}
                    hintsVisible={(hintsVisible) => this.setHintsVisibility(hintsVisible)}
                    selectedCategory={this.state.selectedCategory} />

                {(this.state.hintsVisible) ? (
                    null
                ) : (
                    <PerfectScrollbar>
                        <ul className="categories">
                            {categories}
                        </ul>
                    </PerfectScrollbar>
                )}
                
            </div>
        );

        return (
            <div className="right-panel">
                <InformationBox bottomPart={bottomPart}/>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    categories: state.categories,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({
    createCategory,
    updateCategory,
    }, dispatch);

  export default connect(mapStateToProps, mapDispatchToProps)(WordsCategories);
