const initialState = {
    // For molecular orbitals...
    no_of_atoms: 0,
    atomic_colors: [],

    atoms_x: [],
    atoms_y: [],
    atoms_z: [],

    xdim: 0,
    ydim: 0,
    zdim: 0,

    vmax: 0,
    vmin: 0,

    bond_lengths: [],

    density_data: {},
    density_data2: {},

    // For atomic orbitals...
    x_coords: [],
    y_coords: [],
    z_coords: [],

    n_value: 0,
    l_value: 0,
    m_value: 0,

    element: ''
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