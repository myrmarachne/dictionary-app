import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home/Home';
import Category from '../Category/Category';
import Word from '../Word/Word';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';
import { loadCategories, createCategory } from '../../modules/categories';

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
    const categoriesList = (this.props.categories.categories || []).map(category =>
      <li key={category.id}>{category.name}</li>
    );

    return (
      <div className="app">
        <h1>Kategorie</h1>
        <button onClick={() => this.testCreateCategory()}>Utwórz nową kategorię</button>
        <ul>
          {categoriesList}
        </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
