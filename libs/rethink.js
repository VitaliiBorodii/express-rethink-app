/*jshint node:true */
'use strict';

import config from './config';
import thinky from 'thinky';
export default thinky({
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    db: config.get('rethink:db')
});