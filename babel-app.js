require('babel-core/register');
require('./app');


if (process.env.NODE_ENV !== 'production') {
    setInterval(function () {
        var stat = process.memoryUsage();
        console.log('rss:',(stat.rss/1048576).toFixed(2) + ' MB', 'heapTotal:',(stat.heapTotal/1048576).toFixed(2) + ' MB', 'heapUsed:',(stat.heapUsed/1048576).toFixed(2) + ' MB');
    }, 60000);
}