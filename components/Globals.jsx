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

export const getAtomColour = (
  element
) => {
  /*
    Getting the atom colour based upon the element name
    and the colour it emits while combusting
  
    Parameters
    ----------
    element: String
        Name of the element
    volume: Float
        Volume that correspond with each coordinate of the Canvas
  
    Returns
    -------
    String
        Contains the HEX information of the generated colour
    */
  switch (element) {
    case "H":
      return '#3fc6f2';

    case "Be":
      return "#FFFFFF";

    case "B":
      return "#00FF00";

    case "Li":
      return '#FFC0CB';

    case "Na":
      return "#FFFF00";

    case "K":
      return "#C8A2C8";

    case "O":
      return "#FFA500";

    case "Cu":
      return '#00CC99';

    default:
      return "#FFFF00";
  }
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

  // Key: Molecule Name, Value: Molecule to Subtract
export const moleculesWithLonePairs = {
  "H2O": "O",
}

export const moleculeDict = {
  H2O: [
    "Water",
    "Water is an inorganic, transparent, tasteless, odourless, and nearly colourless chemical substance.",
  ],
  H2: [
    "Hydrogen Gas",
    "Hydrogen is the lightest element. At standard conditions hydrogen is a gas of diatomic molecules having the formula H2.",
  ],
  Cl2: [
    "Chlorine Gas",
    "Chlorine is a yellow-green gas at room temperature. Chlorine has a pungent, irritating odor similar to bleach that is detectable at low concentrations.",
  ],
  HCl: [
    "Hydrochloric Acid",
    "Hydrochloric acid is the water-based, or aqueous, solution of hydrogen chloride gas.",
  ],
};

export const bondShapeDict = {
  H2O: [[0, 1], [0, 2]],
  H2: [[0, 1]],
  Cl2: [[0, 1]],
  HCl: [[0, 1]],
};

export const atomDict = {
  H: [
    "H",
    "Hydrogen Atom",
    "Atom",
    "Hydrogen is the lightest element. It is colorless, odorless, tasteless, non-toxic, and highly combustible.",
    "1s^1"
  ],
  Be: [
    "Be",
    "Beryllium Atom",
    "Atom",
    "Beryllium is a chemical element with the symbol Be and atomic number 4. It is a steel-gray, strong, lightweight and brittle alkaline earth metal.",
    "[He] 2s^2"
  ],
  B: [
    "B",
    "Boron Atom",
    "Atom",
    "Boron is a chemical element with the symbol B and atomic number 5. In its crystalline form it is a brittle, dark, lustrous metalloid; in its amorphous form it is a brown powder.",
    "[He] 2s^2 2p^1"
  ],
  O: [
    "O",
    "Oxygen Atom",
    "Atom",
    "Oxygen is a colourless, odourless, tasteless gas essential to living organisms, being taken up by animals, which convert it to carbon dioxide; plants, in turn, utilize carbon dioxide as a source of carbon and return the oxygen to the atmosphere.",
    "[He] 2s^2 2p^4"
  ],
  Cu: [
    "Cu",
    "Copper Atom",
    "Atom",
    "Copper is a chemical element with the symbol Cu (from Latin: cuprum) and atomic number 29. It is a soft, malleable, and ductile metal with very high thermal and electrical conductivity.",
    "[Ar] 4s^1 3d^10"
  ],
  Li: [
    "Li",
    "Lithium Atom",
    "Atom",
    "A lithium atom is an atom of the chemical element lithium. Stable lithium is composed of three electrons bound by the electromagnetic force to a nucleus containing three protons along with either three or four neutrons, depending on the isotope, held together by the strong force.",
    "1s^2 2s^1"
  ],
  Na: [
    "Na",
    "Sodium Atom",
    "Atom",
    "Sodium is a very soft silvery-white metal. Sodium is the most common alkali metal and the sixth most abundant element on Earth, comprising 2.8 percent of Earth’s crust.",
    "[Ne] 3s^1"
  ],
  K: [
    "K",
    "Potassium Atom",
    "Atom",
    "Potassium is a silvery-white metal that is soft enough to be cut with a knife with little force. Potassium metal reacts rapidly with atmospheric oxygen to form flaky white potassium peroxide in only seconds of exposure.",
    "[Ar] 4s^1"
  ]
};