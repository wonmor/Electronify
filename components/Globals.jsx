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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
export function hslToRgb(h, s, l){
  var r, g, b;

  if (s == 0){
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

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