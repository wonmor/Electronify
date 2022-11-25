const initialState = {
    counter: 0,
    items: [],
  };
   
  const reducers = (state = initialState, action) => {
    switch (action.type) {
      case 'REMOVE_ITEM':
        let newItem =
          state.items.filter((item) => {
          return action.payload.id != item.id;
        });
        return Object.assign({}, state, {
          counter: state.counter - 1,
          items: newItem,
        });

      case 'ADD_ITEM':
        return Object.assign({}, state, {
          counter: state.counter + 1,
          items: [...state.items, action.payload],
        });

      default:
        return state;
    }
  };
   
  export default reducers;