import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home/Home';
import Category from '../Category/Category';
import Word from '../Word/Word';
import NavigationPanel from '../NavigationPanel/NavigationPanel';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';
import { loadCategories, createCategory } from '../../modules/categories';

import { withRouter } from 'react-router-dom'


class App extends Component {
  componentDidMount() {
    this.props.loadCategories();
  }

  testCreateCategory() {
    this.props.createCategory({
      name: 'nowaKategoria',
    });
  }
 

  render() {
    return (
      <div className="app">

        <NavigationPanel />

        {/*<h1>Kategorie</h1>
        <button onClick={() => this.testCreateCategory()}>Utwórz nową kategorię</button>
        <ul>
          {categoriesList}
        </ul>*/}
        <Switch>
          <Route exact path="/category/:categoryId" component={Category} />
          <Route exact path="/word/:wordId" component={Word} />
          <Route path="/" component={Home} /> 
        </Switch>
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
    loadCategories,
  }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
