import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createCategory, updateCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import configuration from '../../configuration';
import CategoriesHints from '../CategoriesHints/CategoriesHints';
import './CategoryAdder.css'

class CategoryAdder extends Component {

    constructor(props){
        super(props);

        this.state = {
            addCategoryInputVisible: false,
            newCategoryName: '',
            addExistingCategory : true
        };
    }

    static propTypes = {
        newCategoryName: PropTypes.string,
        addCategoryInputVisible : PropTypes.bool
    };

    static getDerivedStateFromProps(props, state){

        const newState = {};
        
        if (props.categories.categories !== state.categories){
            newState.categories = props.categories.categories;
            newState.hintsFilter = "";
        }

        if (props.selectedCategory != null){
            newState.addCategoryInputVisible = false;
            newState.addExistingCategory = true;
        }

        return newState;
    }

    setNameOfNewCategory(event) {
        this.setState({
            newCategoryName : event.target.value
        });        
    }

    toggleNewCategoryInput(){
        this.setState({
            addCategoryInputVisible : !this.state.addCategoryInputVisible,
            newCategoryName: ''
        }, () => {
            if (this.props.hintsVisible)
                this.props.hintsVisible(this.state.addCategoryInputVisible)
        });
    }

    saveCategoryName(){
        const word = this.props.word;

        /* Check if category with the provided name already exists */
        const nameOfCategory = this.state.newCategoryName;

        const category = (Object.values(this.state.categories).find(c => 
            c.name.toUpperCase() === nameOfCategory.toUpperCase()));
        
        if (category == null){

        /* Create the category in case if it does not exist */                
            this.props.createCategory({
                name: this.state.newCategoryName,
              }).then(() => {
                /* Assign the word to the newly created category, if it is provided */
                if (word){
                    const category = (Object.values(this.state.categories).find(c => 
                        c.name.toUpperCase() === nameOfCategory.toUpperCase()));
                    
                    if (category){
                        const newWord =  Object.assign({}, word);
    
                        if (newWord.categories.indexOf(category.id) < 0){
                            const oldCategories = newWord.categories;
                            newWord.categories.push(category.id);
                            this.props.updateWordCategories(newWord);
                        }
                    }
                }
              });

              this.setState({
                addCategoryInputVisible: false,
                newCategoryName: ''              
              });

        } else if (word != null) {
            /* Assign the word to the existing category, if it is provided */

            const newWord =  Object.assign({}, word);

            if (newWord.categories.indexOf(category.id) < 0){
                const oldCategories = newWord.categories;
                newWord.categories.push(category.id);
                this.props.updateWordCategories(newWord);
            }

            this.setState({
                addCategoryInputVisible: false,
                newCategoryName: ''              
              });

        }

        if (this.props.hintsVisible)
            this.props.hintsVisible(false);

    }

    createCategory(event){

        if (event.key === "Enter"){
            this.saveCategoryName();

        } else if (event.key === "Escape") {
            this.setState({
                addCategoryInputVisible: false,
                newCategoryName: ''              
              });
        }
    }

    selectCategory(categoryId){

        const word = this.props.word;
        const newWord =  Object.assign({}, word);
    
        if (newWord.categories.indexOf(categoryId) < 0){
            const oldCategories = newWord.categories;
            newWord.categories.push(categoryId);
            this.props.updateWordCategories(newWord);
        }

        this.setState({
            addCategoryInputVisible: false,
            newCategoryName: ''              
        });

        if (this.props.hintsVisible)
            this.props.hintsVisible(false);
        
    }


    render() {
        
        console.log(this.state.newCategoryName.length);

        const categoryAddInput = this.state.addCategoryInputVisible ? (
            <div className="panel-item categories-item add-category">
                <input type="text" value={this.state.newCategoryName}
                    onChange = {(event) => this.setNameOfNewCategory(event)}
                    onKeyUp = {(event) => this.createCategory(event)}
                    autoFocus
                    className="category-link category-search" placeholder="Nowa kategoria" />
               
                <i className={(this.state.newCategoryName.length > 0) ? ("far fa-check-circle") : ("far fa-check-circle disabled")}
                    onClick={() => this.saveCategoryName()}></i>
                <i className="far fa-times-circle"
                    onClick={(event) => this.toggleNewCategoryInput()}></i>
            </div>
        ) : (null);


        return (
            
            <div>
                <div className="categories-header">
                    <span className="categories-header-text">
                        Kategorie {this.props.word ? ("słówka") : (null)}
                    </span><i className="fas fa-plus add-icon" 
                        onClick={(event) => this.toggleNewCategoryInput()}></i>
                </div>
                
                {categoryAddInput}

                {(this.state.addCategoryInputVisible && this.props.word) ? (
                    <CategoriesHints selectCategory={(categoryId) => this.selectCategory(categoryId)} 
                        filter={this.state.newCategoryName}
                        hide={this.props.word.categories} />
                ) : (null)}

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
    updateCategory
  }, dispatch);

  export default connect(mapStateToProps, mapDispatchToProps)(CategoryAdder);
