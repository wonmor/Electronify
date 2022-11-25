export const addToRecord = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: item,
      });
    };
  };
   
  export const removeFromRecord = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: item,
      });
    };
  };
   
  export const getElementData = (elementName) => {
    return (dispatch) => {
      fetch(`https://electronvisual.org/api/load/${elementName}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: responseJson,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
  };
  