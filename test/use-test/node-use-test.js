GLOBAL._ = require('underscore');
var Px = require('../../lib/px.js'),
    fs = require('fs');

var pxfile = '../testData/VSA31.px';

fs.readFile(pxfile, 'binary', function(err, data) {
    if (err) { throw err; }
    console.log('\Loading ' + pxfile + '...');
    px = new Px(data);
console.log(px.explicitDatatable());
});


