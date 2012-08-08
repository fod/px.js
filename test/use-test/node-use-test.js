GLOBAL._ = require('underscore');
var Px = require('../../lib/px.js'),
    fs = require('fs');

var pxfile = '../testData/020101.px';

fs.readFile(pxfile, 'utf8', function(err, data) {
    if (err) { throw err; }
    console.log('\Loading ' + pxfile + '...');
    px = new Px(data);
    console.log(px.codes(0).length);
    console.log(px.code("Яворівський район", "Рік"));
console.log(px.variables());
});


