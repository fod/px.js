var Px = require('../../lib/px.js'),
    fs = require('fs');

var pxfile = '../testData/VSA31.px';

fs.readFile(pxfile, 'utf8', function(err, data) {
    if (err) { throw err; }
    console.log('\Loading ' + pxfile + '...');
    px = new Px(data);
});


