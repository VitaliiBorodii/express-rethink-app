var environment = process.env.NODE_ENV;
var dev = environment !== 'production';
console.log('App is running in', (dev ? 'development' : 'production'), 'mode');
var dir;
if (dev) {
    require('babel-core/register');
    dir = './src';
} else {
    dir = './dist';
}

var path = require('path');
var app = require(dir).default;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dot');


if (dev) {
    setInterval(function () {
        var stat = process.memoryUsage();
        console.log('rss:',(stat.rss/1048576).toFixed(2) + ' MB', 'heapTotal:',(stat.heapTotal/1048576).toFixed(2) + ' MB', 'heapUsed:',(stat.heapUsed/1048576).toFixed(2) + ' MB');
    }, 1000);
}