export const normalizeData = (val, max, min) => {
    /*
        This function normalizes a given dataset within a certain range that is defined

        Parameters
        ----------
        val: Float
        A value that has to be normalized within a range
        max: Float
        The desired upper limit of the value
        min: Float
        The desired lower limit of the value

        Returns
        -------
        Float
        Returns a normalized float value contained within the boundary set
        */

    return (val - min) / (max - min);
};

export const getMoleculeColour = (
    element,
    volume,
    lonePairHighlight = false
  ) => {
    /*
      Getting the molecule colour based upon the element name and the volume information
    
      Parameters
      ----------
      element: String
          Name of the element
      volume: Float
          Volume that correspond with each coordinate of the Canvas
    
      Returns
      -------
      String
          Contains the RGB information of the generated colour
      */
    switch (element) {
      case "H":
        return `hsl(${volume * 100.0 + 800.0}, 100%, 60%)`;
  
      case "O":
        return `hsl(${volume * 1500.0 + 200.0}, 100%, 60%)`;
  
      case "H2":
        return `hsl(${volume * 100.0 + 800.0}, 100%, 60%)`;
  
      case "Cl2":
        return `hsl(${volume * 2000.0 + 200.0}, 100%, 60%)`;
  
      case "H2O":
        return lonePairHighlight
          ? `hsl(${volume * 1500.0 + 200.0}, 100%, 60%)`
          : `hsl(${volume * 5000.0 + 180.0}, 100%, 60%)`;
  
      case "HCl":
        return `hsl(${volume * 24000.0 + 200.0}, 100%, 60%)`;
  
      default:
        return `hsl(${volume * 100.0 + 800.0}, 100%, 60%)`;
    }
  };