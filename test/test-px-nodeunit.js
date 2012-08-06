GLOBAL._ = require('underscore');
var Px = require('../lib/px.js'),
    fs = require('fs');

var testData = require('./testData.json');
var numTestCases = testData.length;

var arrayOfZeroes = function(l) {
    var a = [];
    while (l--) {
        a[l] = 0;
    }
    return a;
};

var runTests = function(i) {
    var px = {};
    var pxfile = 'test/testData/' + testData[i].filename;
    var testPrefix = i;
    exports[testPrefix + '-Instantiation'] = function(test) {
        fs.readFile(pxfile, testData[i].encoding, function(err, data) {
            if (err) { throw err; }
            console.log('\nTesting ' + pxfile + '...');
            px = new Px(data);

            test.expect(2);

            test.ok(px, 'px exists');
            test.equal(typeof(px), 'object', 'px is an object');

            test.done();
        });
    };

    exports[testPrefix + '-Metadata'] = function(test) {
	var numVars = px.variables().length;

        test.expect(5 + (numVars * 2));

        test.ok(px.title(), 'Px object has title');
        test.equal(px.title(), testData[i].title, 'Title is correct');
        test.equal(_.size(px.metadata), testData[i].numKeywords, 'Correct number of metadata entries');
     	test.equal(numVars, testData[i].numVars, 'Correct number of variables');
	test.deepEqual(px.variables(), testData[i].varNames, 'Correct array of variable names');

	for (var varNum = 0; varNum < numVars; varNum++) {

	    var varName = testData[i].varNames[varNum];

	    test.equal(px.values(varNum).length, testData[i].numVals[varNum], 
		       'Correct number of values (accessed by variable index) for variable ' 
		       + varNum + ' (' + varName + ')');

	    test.equal(px.values(testData[i].varNames[varNum]).length, testData[i].numVals[varNum], 
		       'Correct number of values (accessed by variable name) for variable ' 
		       + varNum + ' (' + varName + ')');

	}

        test.done();
    };

    exports[testPrefix + '-Data'] = function(test) {
        test.expect(3);

        test.equal(_.size(px.data), testData[i].numData, 'Correct number of data points');
        test.equal(px.datum(arrayOfZeroes(_.size(px.variables()))), 
                   testData[i].firstDatum, 'Correct value for first data point');

        var lastDatum = _.map(px.valCounts(), function(d) { return d - 1; });
        test.equal(px.datum(lastDatum), testData[i].lastDatum, 'Correct value for last data point');

        test.done();
    };

};

for (var i = 0; i < numTestCases; i++) {
    runTests(i);
}
