/*jshint node:true */
'use strict';

import thinky from '../libs/rethink'

export default thinky.createModel("users", {
    id: String
});
