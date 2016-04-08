require('babel-core/register');
require('./app');


if (process.env.NODE_ENV !== 'production') {
    setInterval(function () {
        var stat = process.memoryUsage();
        console.log('Memory:',(stat.rss/1048576).toFixed(2) + ' MB');
    }, 60000);
}