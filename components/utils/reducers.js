const initialState = {
    counter: 0,
    bookmarkItems: [],
    sort: 'NA',
    postData: [],
  };
   
  const reducers = (state = initialState, action) => {
    switch (action.type) {
      case 'REMOVE_BOOKMARK':
        let newBookmarkItems =
          state.bookmarkItems.filter((bookmarkPost) => {
          return action.payload.id != bookmarkPost.id;
        });
        return Object.assign({}, state, {
          counter: state.counter - 1,
          bookmarkItems: newBookmarkItems,
        });
      case 'ADD_BOOKMARK':
        return Object.assign({}, state, {
          counter: state.counter + 1,
          bookmarkItems: [...state.bookmarkItems, action.payload],
          postData: filter_records(state.postData, [
            ...state.bookmarkItems,
            action.payload,
          ]),
          sort: 'NA',
        });
      case 'SORT_BOOKMARK_LIST':
        let sortedBookMarks = state.bookmarkItems;
        let sortOrder = 'NA';
        if (state.sort == 'NA') {
          sortedBookMarks.sort(sort_by('id', true, parseInt));
          sortOrder = 'ASC';
        } else if (state.sort == 'ASC') {
          sortedBookMarks.sort(sort_by('id', false, parseInt));
          sortOrder = 'DESC';
        } else if (state.sort == 'DESC') {
          sortedBookMarks.sort(sort_by('id', true, parseInt));
          sortOrder = 'ASC';
        }
        return Object.assign({}, state, {
          sort: sortOrder,
          bookmarkItems: [...sortedBookMarks],
        });
      case 'POST_LIST_DATA':
        return Object.assign({}, state, {
          postData: filter_records(
            action.payload,
            state.bookmarkItems
          ),
        });
      default:
        return state;
    }
  };
   
  const filter_records = (mainArray, childArray) => {
    return mainArray.filter((mainElement) => {
      if (childArray.length > 0) {
        let isReturnable = true;
        childArray.forEach((childElement) => {
          if (Number(mainElement.id) === Number(childElement.id)) {
            isReturnable = false;
          }
        });
        return isReturnable;
      } else return mainElement;
    });
  };
   
  const sort_by = (field, reverse, primer) => {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };
    reverse = !reverse ? 1 : -1;
    return function (a, b) {
      return
        (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };
   
  export default reducers;
  