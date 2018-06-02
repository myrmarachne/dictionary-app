import React, { Component } from 'react';
import { connect } from 'react-redux';
import WordsList from '../WordsList/WordsList';
import { bindActionCreators } from 'redux';
import { deleteCategory, updateCategory } from '../../modules/categories';

class Category extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categoryNotFound: false,
    }

  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    // search for category in store
    const categories = props.categories.categories;
    if (props.categories.categories) {
      const category = categories
        .filter(c => String(c.id) === props.match.params.categoryId)[0];
      if (category) {
        newState.category = category;
      } else{
        newState.categoryNotFound = true;
      }
    }
    return newState;
  }

  deleteCategory() {
    this.props.deleteCategory(this.state.category);
  }

  deleteWord(word) {
    const category = Object.assign({}, this.state.category);
    category.words = category.words.filter(wordId => wordId !== word.id);
    return this.props.updateCategory(category);
  }

  updateDemo() {
    this.props.updateCategory(Object.assign({}, this.state.category, {name: 'test2'}));
  }

  render() {
    if (this.state.category)
      document.title = this.state.category.name.toUpperCase();
    else
      document.title = "Kategoria";

    return (
      <div className="category">
        {this.state.category ? (
          <div>
            <h1>{this.state.category.name}</h1>
            <button onClick={() => this.deleteCategory()}>Delete</button>
            <button onClick={() => this.updateDemo()}>test update</button>
            <WordsList
              category={this.state.category}
              deleteWord={(word) => this.deleteWord(word)} />
          </div>
         ) : (
          <p>Ładowanie kategorii...</p>
        )}
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
