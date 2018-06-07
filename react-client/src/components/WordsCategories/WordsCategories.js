import React, { Component } from 'react';
import { connect } from 'react-redux';
import configuration from '../../configuration';

import { createCategory, updateCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import './WordsCategories.css' 


class WordsCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
          word: undefined,
    
          addCategoryInputVisible: false,
          newCategoryName: '',
          categories: undefined
        }
      }

    static getDerivedStateFromProps(props, state){

        const newState = {};
        
        if (props.categories.categories !== state.categories){
            newState.categories = props.categories.categories;
        }

        if (props.word !== state.word){
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

    deleteWordFromCategory(categoryId){
        const newWord = Object.assign({}, this.state.word);
        newWord.categories = this.state.word.categories.filter(cid => cid !== categoryId);

        this.updateWordCategories(newWord);
    }


    setNameOfNewCategory(event) {
        this.setState({newCategoryName : event.target.value});        
    }

    createCategory(event){

        if (event.key === "Enter" && this.state.newCategoryName.length > 0){
            
            /* Check if category with the provided name already exists, and if not - 
            create it and add the word to it */
            const nameOfCategory = this.state.newCategoryName;

            const category = (Object.values(this.state.categories).find(c => 
            c.name.toUpperCase() === nameOfCategory.toUpperCase()));
            
            if (category == null){
            
            /* Create the category in case if it does not exist */
            this.props.createCategory({
                name: nameOfCategory,
            }).then(() => {
                /* Assign this particular word to the newly created category */

                const category = (Object.values(this.state.categories).find(c => 
                c.name.toUpperCase() === nameOfCategory.toUpperCase()));
                
                if (category) {
                    const word =  Object.assign({}, this.state.word);

                    if (word.categories.indexOf(category.id) < 0){
                        word.categories.push(category.id);
                        this.updateWordCategories(word);
                    }
                }
                
            });
                
            } else {

                /* Assign the word to the existing category */
                const category = (Object.values(this.state.categories).find(c => 
                    c.name.toUpperCase() === nameOfCategory.toUpperCase()));
                    
                    if (category) {
                        const word =  Object.assign({}, this.state.word);
    
                        if (word.categories.indexOf(category.id) < 0){
                            word.categories.push(category.id);
                            this.updateWordCategories(word);
                        }
                    }
                
            }

            this.setState({
                addCategoryInputVisible: false,
                newCategoryName: ''              
            });

        } else if (event.key === "Escape") {
            this.setState({
                addCategoryInputVisible: false,
                newCategoryName: ''              
                });
        }
    }

    updateWordCategories(word){
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
              (word.categories || []).map(categoryId =>{
                
                const category = (this.state.categories || []).find(category =>
                    (category.id === categoryId));

                if (category.words.indexOf(word.id) < 0)
                    category.words.push(word.id);
                
                this.props.updateCategory(category, false);
                }
            )
          })
        );
      }

    render(){
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

        /* If the input for category adding is not visible - show the categories, this word 
        is belonging to. If it is visible - hide the assigned categories list, and show 
        list of categories suggestions instead */

        const categoryAddInput = (

        <li className="panel-item categories-item">
            <input type="text" value={this.state.newCategoryName}
                onChange = {(event) => this.setNameOfNewCategory(event)}
                onKeyUp = {(event) => this.createCategory(event)}
                autoFocus
                className="category-link category-search" placeholder="Nowa kategoria" />
        </li>
        );

        const categoriesSuggestions = (this.props.categories.categories || [])
        .filter(category => category.name.toUpperCase().startsWith(this.state.categoryFilterValue))
        .map(category =>
            <li key={category.id} className="panel-item categories-item">
                <Link className="category-link" to={`/category/${category.id}`}>
                    <span className="category-text">{category.name}</span>
                    <span className="number-of-words">{category.words.length}</span>
                </Link>
            </li>
        );

        return(
            <div className="right-panel">
            <div className="black-box upper-box">
                <div className="upper-part"><span className="fancy-text">Kategorie słówka</span>
                <i className="fas fa-plus add-icon" onClick={(event) => this.toggleNewCategoryInput()}></i></div>
                <div className="bottom-part">
                    <ul className="categories">
                    {
                        this.state.addCategoryInputVisible ? (
                        (categoryAddInput)
                        ) : (categories)
                    }
                    </ul>
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
    createCategory,
    updateCategory,
    }, dispatch);

  export default connect(mapStateToProps, mapDispatchToProps)(WordsCategories);
