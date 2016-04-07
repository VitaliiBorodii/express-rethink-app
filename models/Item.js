'use strict';

import thinky from '../libs/rethink';

// Create a model - the table is automatically created
export default thinky.createModel("items", {
    id: String,
    title: String
});
