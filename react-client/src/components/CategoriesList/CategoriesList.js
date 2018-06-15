import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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
            .filter(category => category.name.toUpperCase().includes(this.props.filter || ""))
            .sort((categoryA, categoryB) => categoryB.id-categoryA.id)
            .map(category =>
                <li key={category.id} className="panel-item categories-item">
                    <Link className="category-link" to={`/category/${category.id}`}>
                        <span className="category-text">{category.name}</span>
                        <span className="number-of-words">{category.words.length}</span>
                    </Link>
                </li>
        );

        return (
                <ul className="categories">
                    {categoriesList}
                </ul>
        );
    }
    
}

const mapStateToProps = state => ({
    categories: state.categories,
  });

  export default connect(mapStateToProps)(categoriesList);
