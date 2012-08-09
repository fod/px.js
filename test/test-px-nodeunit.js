GLOBAL._ = require('underscore');
var Px = require('../lib/px.js'),
    fs = require('fs'),
    iconv = require('iconv-lite');

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
        fs.readFile(pxfile,'binary', function(err, data) {
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

        test.expect(6 + (numVars * 14));

        // Px.title()
        test.ok(px.title(), 'Px object has title');
        test.equal(px.title(), testData[i].title, 'Title is correct');

        // Px.metadata
        test.equal(_.size(px.metadata), testData[i].numKeywords, 'Correct number of metadata entries');

        // Px.variables()
        test.equal(numVars, testData[i].numVars, 'Correct number of variables');
        test.deepEqual(px.variables(), testData[i].varNames, 'Correct array of variable names');

        for (var varNum = 0; varNum < numVars; varNum++) {

            //var varName = testData[i].varNames[varNum];
            var varName = px.variable(varNum);

            // Px.variable()
            test.equal(px.variable(varNum), varName, 'Access variable name by index');
            test.equal(px.variable(varName), varNum, 'Access variable index by name');

            // Px.values()
            test.equal(px.values(varNum).length, testData[i].numVals[varNum], 
                       'Correct number of values (accessed by variable index) for variable ' 
                       + varNum + ' (' + varName + ')');
            test.equal(px.values(varName).length, testData[i].numVals[varNum], 
                       'Correct number of values (accessed by variable name) for variable ' 
                       + varNum + ' (' + varName + ')');
            test.equal(px.values(varNum)[0], testData[i].firstLastVals[varNum][0],
                       'Correct first value for variable ' + varNum + ' (' + varName + ')');
            test.equal(px.values(varNum)[px.values(varNum).length - 1],
		       testData[i].firstLastVals[varNum][1],
                       'Correct last value for variable ' + varNum + ' (' + varName + ')');

            // Px.codes()
            test.equal(px.codes(varNum).length, testData[i].numVals[varNum], 
                       'Correct number of codes (accessed by variable index) for variable ' 
                       + varNum + ' (' + varName + ')');
            test.equal(px.codes(varName).length, testData[i].numVals[varNum], 
                       'Correct number of codes (accessed by variable name) for variable ' 
                       + varNum + ' (' + varName + ')');
            test.equal(px.codes(varNum)[0], testData[i].firstLastCodes[varNum][0],
                       'Correct first code for variable ' + varNum + ' (' + varName + ')');
            test.equal(px.codes(varNum)[px.values(varNum).length - 1],
		       testData[i].firstLastCodes[varNum][1],
                       'Correct last code for variable ' + varNum + ' (' + varName + ')');

            // Px.value()
            test.equal(px.value(px.codes(varName)[0], varName), 
                       testData[i].firstLastVals[varNum][0],
                       'Correct value returned for first code');
            test.equal(px.value(px.codes(varName)[px.codes(varName).length-1], varName), 
                       testData[i].firstLastVals[varNum][1],
                       'Correct value returned for last code');

            // Px.code()
            test.equal(px.code(px.values(varName)[0], varName), 
                       testData[i].firstLastCodes[varNum][0],
                       'Correct code returned for first value');
            test.equal(px.code(px.values(varName)[px.values(varName).length-1], varName), 
                       testData[i].firstLastCodes[varNum][1],
                       'Correct code returned for last value');

         }

        // Px.valCounts
        test.deepEqual(px.valCounts(), testData[i].numVals, 'Correct value counts array'); 

        test.done();
    };

    exports[testPrefix + '-Data'] = function(test) {
	var numVars = px.variables().length;

        test.expect(4 + (numVars * 6));

        test.equal(_.size(px.data), testData[i].numData, 'Correct number of data points');

        test.equal(px.datum(arrayOfZeroes(px.variables().length)), 
                   testData[i].firstDatum, 'Correct value for first data point');

        var lastDatum = _.map(px.valCounts(), function(d) { return d - 1; });
        test.equal(px.datum(lastDatum), testData[i].lastDatum,
                   'Correct value for last data point');

        var midDatum = _.map(px.valCounts(), function(d) {return Math.floor(d/2); });
        test.equal(px.datum(midDatum), testData[i].midDatum,
                   'Correct value for middle data point (' + midDatum + ')');

	for (var varNum = 0; varNum < numVars; varNum++) {

	    var zeroArray = arrayOfZeroes(px.variables().length);
	    zeroArray.splice(varNum, 1, '*');
	    var zeroDataCol = px.datacol(zeroArray);

	    var maxArray = _.map(px.valCounts(), function(d) {return d-1;});
	    maxArray.splice(varNum, 1, '*');
	    var maxDataCol = px.datacol(maxArray);

	    test.equal(zeroDataCol.length, testData[i].numVals[varNum],
		       'Correct number of values return for zero-based datacol');
	    test.equal(maxDataCol.length, testData[i].numVals[varNum],
		       'Correct number of values return for maximum-based datacol');

	    test.equal(zeroDataCol[0], testData[i].firstLastZeroData[varNum][0],
		       'Correct first value on zero-based datacol'); 
	    test.equal(maxDataCol[0], testData[i].firstLastMaxData[varNum][0],
		       'Correct first value on maximum-based datacol');

	    var maxIdx = maxArray[varNum];
	    test.equal(zeroDataCol[maxIdx], testData[i].firstLastZeroData[varNum][1],
		       'Correct last value on zero-based datacol'); 
	    test.equal(maxDataCol[maxIdx], testData[i].firstLastMaxData[varNum][1],
		       'Correct last value on maximum-based datacol');
	}

        test.done();
    };

};

for (var i = 0; i < numTestCases; i++) {
    runTests(i);
}
