import { combineReducers } from 'redux';

const INITIAL_STATE = {
  current: {},
};

const elementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state
  }
};

export default combineReducers({
  element: elementReducer
});