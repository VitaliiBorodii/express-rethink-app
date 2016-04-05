import config from './config';
import thinkyLib from 'thinky';
export default thinkyLib({
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    db: config.get('rethink:db')
});