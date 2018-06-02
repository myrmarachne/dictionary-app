import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createCategory } from '../../modules/categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './NavigationPanel.css' 

class NavigationPanel extends Component {

    constructor(props){
        super(props);

        this.state = {
            categoryFilterValue: '',
            addCategoryInputVisible: false,
            newCategoryName: ''
        };

    }

    static propTypes = {
        categoryFilterValue : PropTypes.string,
        newCategoryName: PropTypes.string,
        addCategoryInputVisible : PropTypes.bool
    };

    categoryFilterChange(event) {
        this.setState({categoryFilterValue : event.target.value.toUpperCase()});
    }

    setNameOfNewCategory(event) {
        this.setState({newCategoryName : event.target.value});        
    }

    toggleNewCategoryInput(){
        this.setState({
            addCategoryInputVisible : !this.state.addCategoryInputVisible,
            newCategoryName: ''
        });
    }

    createCategory(event){

        if (event.key === "Enter" && this.state.newCategoryName.length > 0){
            
            this.props.createCategory({
                name: this.state.newCategoryName,
              });

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


    render() {

        const categoriesList = (this.props.categories.categories || [])
            .filter(category => category.name.toUpperCase().startsWith(this.state.categoryFilterValue))
            .map(category =>
                <li key={category.id} className="panel-item categories-item">
                    <Link className="category-link" to={`/category/${category.id}`}>
                        <span className="category-text">{category.name}</span>
                        <span className="number-of-words">{category.words.length}</span>
                    </Link>
                </li>
        );

        const categoryAddInput = this.state.addCategoryInputVisible ? (
            <li className="panel-item categories-item">
                <input type="text" value={this.state.newCategoryName}
                    onChange = {(event) => this.setNameOfNewCategory(event)}
                    onKeyUp = {(event) => this.createCategory(event)}
                    autoFocus
                    className="category-link category-search" placeholder="Nowa kategoria" />
            </li>
        ) : (null);


        return (
            <div className="navigation-panel">

                <Link className="logo" to={`/`}></Link>
                <Link className="main-page-button not-selectable" to={`/`}>Strona główna</Link>

                <div className="search-input">
                    <input type="text" className="main-search" placeholder="Szukaj słówka..." />
                    <i className="fas fa-search search-icon"></i>
                </div>

                
                <div className="categories-header">
                    <span className="categories-header-text">Kategorie</span>
                    <i className="fas fa-plus add-icon" 
                        onClick={(event) => this.toggleNewCategoryInput()}></i>
                </div>

                <div className="panel-item categories-item all-words-link clickable-menu-item">
                    <Link className="category-link" to={`/`}>Wszystkie słówka</Link>
                </div>

                <div className="panel-item">
                    <input type="text" value={this.state.categoryFilterValue} 
                        onChange={(event) => this.categoryFilterChange(event)} 
                        className="category-link category-search" placeholder="Znajdź kategorię..." />
                </div>

                <ul className="categories">
                    {categoryAddInput}
                    {categoriesList}
                </ul>

                <div className="bottom-buttons">
                    <Link className="bottom-button not-selectable" to={`/`}>Konto</Link>
                    <Link className="bottom-button not-selectable" to={`/`}>Wyloguj</Link>
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
  }, dispatch);

  export default connect(mapStateToProps, mapDispatchToProps)(NavigationPanel);
