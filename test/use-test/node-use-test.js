GLOBAL._ = require('underscore');
var Px = require('../../lib/px.js'),
    fs = require('fs'),
    iconv = require('iconv-lite');

var pxfile = '../testData/020101.px';

fs.readFile(pxfile, 'binary', function(err, data) {
    if (err) { throw err; }
    console.log('\Loading ' + pxfile + '...');
    var decoded = iconv.decode(data, 'Windows-1251');
    px = new Px(decoded);
    console.log(px.variables());
    var v1 = px.variable(0);
    console.log(v1);
    var val = px.values(v1)[px.values(v1).length-1];
    console.log(px.code(val, v1));
});


