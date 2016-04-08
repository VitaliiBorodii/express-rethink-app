'use strict';

import thinky from '../libs/rethink';
var type = thinky.type;

// Create a model - the table is automatically created
export default thinky.createModel("items", {
    id: type.string(),
    title: type.string()
});
