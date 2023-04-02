export const appendToRecord = (item) => {
  return (dispatch) => {
    dispatch({
      type: "APPEND_ITEM",
      payload: item,
    });
  };
};

export const removeFromRecord = (item) => {
  return (dispatch) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: item,
    });
  };
};

export const resetState = () => {
  return {
    type: "RESET_STATE",
  };
};

export const getElementData = (elementName, type) => {
  let urlToFetch = type == "atom" ? "loadSPH" : "load";

  return async (dispatch) => {
    await fetch(
      `https://www.electronvisual.org/api/${urlToFetch}/${elementName}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        dispatch({
          type: "WRITE_ITEM",
          payload: { ...responseJson, element: elementName },
        });

        if (elementName === "H2O") {
          await fetch(`https://www.electronvisual.org/api/${urlToFetch}/O`, {
            method: "GET",
          })
            .then((response2) => response2.json())
            .then((responseJson2) => {
              dispatch({
                type: "APPEND_ITEM",
                payload: { density_data2: responseJson2.density_data },
              });
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
