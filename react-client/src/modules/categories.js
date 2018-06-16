import fetch from 'cross-fetch';
import configuration from '../configuration';

export const REQUEST_CATEGORIES = 'categories/REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'categories/RECEIVE_CATEGORIES';
export const HANDLE_CATEGORIES_LOAD_ERROR = 'categories/HANDLE_CATEGORIES_LOAD_ERROR';
export const CREATE_CATEGORY = 'categories/CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'categories/UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'categories/DELETE_CATEGORY';


const initialState = {
  categories: undefined,
  categoriesLoading: false,
  categoriesLoadError: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        categories: undefined,
        categoriesLoading: true,
        categoriesLoadError: null,
      };
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        categoriesLoading: false,
        categoriesLoadError: null,
      };
    case HANDLE_CATEGORIES_LOAD_ERROR:
      return {
        ...state,
        categories: undefined,
        categoriesLoading: false,
        categoriesLoadError: action.error,
      };
    case CREATE_CATEGORY:
      return {
        ...state,
        categories: [action.category, ...state.categories],
      };
    case UPDATE_CATEGORY:
      const categories = state.categories.slice(0);
      categories[categories.map(t => t.id).indexOf(action.category.id)] = action.category;
      return {
        ...state,
        categories,
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(c => c !== action.category),
      };
    default:
      return state;
  }
};

export const loadCategories = () => {
  return dispatch => {
    dispatch({
      type: REQUEST_CATEGORIES,
    });
    return fetch(configuration.backendUrl + '/categories')
      .then(response => response.json())
      .then(ids => Promise.all(ids.map(id =>
        fetch(configuration.backendUrl + '/categories/' + id)
          .then(response => response.json())
      )))
      .then(categories => {
        dispatch({
          type: RECEIVE_CATEGORIES,
          categories,
        })
      })
      .catch((error) => {
        dispatch({
          type: HANDLE_CATEGORIES_LOAD_ERROR,
          error,
        })
      });
  }
};

export const createCategory = (category) => {
  return dispatch => {
    return fetch(configuration.backendUrl + '/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category),
    })
    .then(response => response.json())
    .then(category => {
      dispatch({
        type: CREATE_CATEGORY,
        category,
      });
    });
  };
};


export const updateCategory = (category, writeOnServer=true) => {
  if (writeOnServer){
    return dispatch => {
      return fetch(configuration.backendUrl + '/categories/' + category.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category),
      })
      .then(() => {
        dispatch({
          type: UPDATE_CATEGORY,
          category,
        });
        console.log(category);
      });
    };
  } else {
    return dispatch => {
      dispatch({
        type: UPDATE_CATEGORY,
        category,
      });
    }
  }
};

export const deleteCategory = (category) => {
  return dispatch => {
    return fetch(configuration.backendUrl + '/categories/' + category.id, {
      method: 'DELETE',
    })
    .then(() => {
      dispatch({
        type: DELETE_CATEGORY,
        category,
      });
    });
  };
};
