import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './CategoriesHints.css' 

class categoriesList extends Component {

    constructor(props){
        super(props);

        this.state = {
            categories : undefined,
        };
    }


    static getDerivedStateFromProps(props, state){

        const newState = {};
        
        if (props.categories.categories !== state.categories){
            newState.categories = props.categories.categories;
        }

        return newState;
    }

    render() {

        const categoriesList = (this.state.categories || [])
            .filter(category => category.name.toUpperCase().includes((this.props.filter || "").toUpperCase()))
            .filter(category => (this.props.hide.indexOf(category.id) < 0))
            .sort((categoryA, categoryB) => categoryB.id-categoryA.id)
            .map(category =>
                <li key={category.id} className="panel-item categories-item">
                    <a className="category-link">
                        <span className="category-text" 
                        onClick={(event) => this.props.selectCategory(category.id)}>{category.name}</span>
                    </a>
                </li>
        );

        return (
                <ul className="categories categories-hints">
                    {categoriesList}
                </ul>
        );
    }
    
}

const mapStateToProps = state => ({
    categories: state.categories,
  });

  export default connect(mapStateToProps)(categoriesList);
