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

    case "F":
      return "#0CBAA6";

    case "Ne":
      return "#39FF14";

    case "Fe":
      return "#ffff00";

    case "Co":
      return "#0000FF";

    case "Ni":
      return "#727472"

    case "Cu":
      return '#00CC99';

    case "Zn":
      return "#0D98BA";

    case "Pd":
      return "#87CEEB";

    case "Ce":
      return "#FFFF00";
    
    case "Pr":
      return "#C0C0C0";

    case "Nd":
      return "#953553";

    case "Pm":
      return "#00FF00";

    case "Sm":
      return "#e03fd8";

    case "Eu":
      return "#FF0000";

    case "Gd":
      return "#c0c0c0";

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
  H: ["H", "Hydrogen Atom", "Atom", "Lightest element. Gas of diatomic molecules. Highly combustible.", "1s^1"],
  Be: ["Be", "Beryllium Atom", "Atom", "Steel-gray, strong, lightweight and brittle alkaline earth metal.", "[He] 2s^2"],
  B: ["B", "Boron Atom", "Atom", "Brittle, dark, lustrous metalloid.", "[He] 2s^2 2p^1"],
  O: ["O", "Oxygen Atom", "Atom", "Colorless, odorless, tasteless gas essential to living organisms.", "[He] 2s^2 2p^4"],
  F: ["F", "Fluorine Atom", "Atom", "Highly reactive pale yellow diatomic gas. Most electronegative element.", "[He] 2s^2 2p^5"],
  Ne: ["Ne", "Neon Atom", "Atom", "Colorless, odorless, inert monatomic gas.", "[He] 2s^2 2p^6"],
  Fe: ["Fe", "Iron Atom", "Atom", "Most common element on Earth. Belongs to first transition series and group 8 of periodic table.", "[Ar] 4s^2 3d^6"],
  Co: ["Co", "Cobalt Atom", "Atom", "Hard, lustrous, silver-gray metal.", "[Ar] 4s^2 3d^7"],
  Ni: ["Ni", "Nickel Atom", "Atom", "Silvery-white lustrous metal with a slight golden tinge.", "[Ar] 4s^2 3d^8"],
  Cu: ["Cu", "Copper Atom", "Atom", "Soft, malleable, and ductile metal with high thermal and electrical conductivity.", "[Ar] 4s^1 3d^10"],
  Zn: ["Zn", "Zinc Atom", "Atom", "First element in group 12 of the periodic table. Chemically similar to magnesium.", "[Ar] 4s^2 3d^10"],
  Pd: ["Pd", "Palladium Atom", "Atom", "Rare and lustrous silvery-white metal with greatest density of any element.", "[Kr] 4d^10"],
  Ce: ["Ce", "Cerium Atom", "Atom", "Soft, ductile, and silvery-white metal that tarnishes when exposed to air.", "[Xe] 6s^2 4f^1"],
  Pr: ["Pr", "Praseodymium Atom", "Atom", "Soft and traditionally considered to be one of the rare-earth elements.", "[Xe] 6s^2 4f^3"],
  Nd: ["Nd", "Neodymium Atom", "Atom", "Fourth member of the lanthanide series and traditionally considered to be one of the rare-earth elements.", "[Xe] 6s^2 4f^4"],
  Pm: ["Pm", "Promethium Atom", "Atom", "Fifth member of the lanthanide series and traditionally considered to be one of the rare-earth elements.", "[Xe] 6s^2 4f^5"],
  Sm: ["Sm", "Samarium Atom", "Atom", "Sixth member of the lanthanide series and traditionally considered to be one of the rare-earth elements.", "[Xe] 6s^2 4f^6"],
  Eu: ["Eu", "Europium Atom", "Atom", "Soft, silvery-white metal that tarnishes when exposed to air.", "[Xe] 6s^2 4f^7"],
  Gd: ["Gd", "Gadolinium Atom", "Atom", "Silvery-white, malleable, and ductile rare earth metal. Third most abundant rare earth element.", "[Xe] 6s^2 5d^1 4f^7"],
  Li: ["Li", "Lithium Atom", "Atom", "Composed of three electrons bound to a nucleus containing three protons. Common alkali metal.", "1s^2 2s^1"],
  Na: ["Na", "Sodium Atom", "Atom", "Very soft silvery-white metal. Sixth most abundant element on Earth.", "[Ne] 3s^1"],
  K: ["K", "Potassium Atom", "Atom", "Silvery-white metal that is soft enough to be cut with a knife with little force. Reacts rapidly with atmospheric oxygen.", "[Ar] 4s^1"]
};
