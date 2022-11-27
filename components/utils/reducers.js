const initialState = {
    no_of_atoms: 0,

    atoms_x: [],
    atoms_y: [],
    atoms_z: [],

    xdim: 0,
    ydim: 0,
    zdim: 0,

    bond_lengths: [],
    density_data: {},
};

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case 'REMOVE_ITEM':
            let filtered = {};

            // Compare two objects and return the difference...
            Object.keys(state).forEach((key1) => {
                // Action.payload has to be an array not a dictionary in this case...
                action.payload.forEach((key2) => {
                    if (key1 !== key2) {
                        filtered[key1] = state[key1];
                    }
                });
            });

            return filtered;

        case 'WRITE_ITEM':
            return action.payload;

        case 'APPEND_ITEM':
            return Object.assign({}, state, action.payload);

        default:
            return state;
    }
};
   
export default reducers;