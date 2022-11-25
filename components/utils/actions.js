export const addToBookmark = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'ADD_BOOKMARK',
        payload: item,
      });
    };
  };
   
  export const removeFromBookmark = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'REMOVE_BOOKMARK',
        payload: item,
      });
    };
  };
   
  export const sortBookMarkList = () => {
    return (dispatch) => {
      dispatch({
        type: 'SORT_BOOKMARK_LIST',
      });
    };
  };
   
  export const getElement = (elementName) => {
    return (dispatch) => {
      fetch(`https://electronvisual.org/api/load/${elementName}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          dispatch({
            type: 'CURRENT_ELEMENT_DATA',
            payload: responseJson,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
  };
  