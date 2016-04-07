import cors from 'cors';
import config from './config';

var whitelist = config.get('corsWhitelist');
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

export default cors(corsOptions)