export const appendToRecord = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'APPEND_ITEM',
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

  export const resetState = () => {
    return {
      type: 'RESET_STATE',
    };
  };
   
  export const getElementData = (elementName, type) => {
    let urlToFetch = type == 'atom' ? 'loadSPH' : 'load';
  
    return async (dispatch) => {
      await fetch(`https://www.electronvisual.org/api/${urlToFetch}/${elementName}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          dispatch({
            type: 'WRITE_ITEM',
            payload: { ...responseJson, element: elementName },
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
  };
  
  