import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './NavigationPanel.css' 
import CategoriesList from '../CategoriesList/CategoriesList';
import CategoryAdder from '../CategoryAdder/CategoryAdder';

class NavigationPanel extends Component {

    constructor(props){
        super(props);

        this.state = {
            categoryFilterValue: '',
        };
        
    }

    static propTypes = {
        categoryFilterValue : PropTypes.string,
    };

    categoryFilterChange(event) {
        this.setState({categoryFilterValue : event.target.value.toUpperCase()});
    }

    render() {

        return (
            <div className="navigation-panel">

                <Link className="logo" to={`/`}></Link>
                <Link className="main-page-button not-selectable" to={`/`}>Strona główna</Link>

                <div className="search-input">
                    <input type="text" className="main-search" placeholder="Szukaj słówka..." />
                    <i className="fas fa-search search-icon"></i>
                </div>

                <CategoryAdder />

                <div className="panel-item categories-item all-words-link clickable-menu-item">
                    <Link className="category-link" to={`/category/all`}>Wszystkie słówka</Link>
                </div>

                <div className="panel-item">
                    <input type="text" value={this.state.categoryFilterValue} 
                        onChange={(event) => this.categoryFilterChange(event)} 
                        className="category-link category-search" placeholder="Znajdź kategorię..." />
                </div>

                <CategoriesList filter={this.state.categoryFilterValue}  />
                
                <div className="bottom-buttons">
                    <Link className="bottom-button not-selectable" to={`/`}>Konto</Link>
                    <Link className="bottom-button not-selectable" to={`/`}>Wyloguj</Link>
                </div>
            </div>
        );
    }
    
}

  export default NavigationPanel;
