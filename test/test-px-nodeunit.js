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
    exports[testPrefix + ' - Instantiation'] = function(test) {
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

    exports[testPrefix + ' - Metadata'] = function(test) {
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
            test.equal(px.values(varNum)[0], testData[i].firstMidLastVals[varNum][0],
                       'Correct first value for variable ' + varNum + ' (' + varName + ')');
            test.equal(px.values(varNum)[px.values(varNum).length - 1],
                       testData[i].firstMidLastVals[varNum][2],
                       'Correct last value for variable ' + varNum + ' (' + varName + ')');

            // Px.codes()
            test.equal(px.codes(varNum).length, testData[i].numVals[varNum], 
                       'Correct number of codes (accessed by variable index) for variable ' 
                       + varNum + ' (' + varName + ')');
            test.equal(px.codes(varName).length, testData[i].numVals[varNum], 
                       'Correct number of codes (accessed by variable name) for variable ' 
                       + varNum + ' (' + varName + ')');
            test.equal(px.codes(varNum)[0], testData[i].firstMidLastCodes[varNum][0],
                       'Correct first code for variable ' + varNum + ' (' + varName + ')');
            test.equal(px.codes(varNum)[px.values(varNum).length - 1],
                       testData[i].firstMidLastCodes[varNum][2],
                       'Correct last code for variable ' + varNum + ' (' + varName + ')');

            // Px.value()
            test.equal(px.value(px.codes(varName)[0], varName), 
                       testData[i].firstMidLastVals[varNum][0],
                       'Correct value returned for first code');
            test.equal(px.value(px.codes(varName)[px.codes(varName).length-1], varName), 
                       testData[i].firstMidLastVals[varNum][2],
                       'Correct value returned for last code');

            // Px.code()
            test.equal(px.code(px.values(varName)[0], varName), 
                       testData[i].firstMidLastCodes[varNum][0],
                       'Correct code returned for first value');
            test.equal(px.code(px.values(varName)[px.values(varName).length-1], varName), 
                       testData[i].firstMidLastCodes[varNum][2],
                       'Correct code returned for last value');

        }

        // Px.valCounts
        test.deepEqual(px.valCounts(), testData[i].numVals, 'Correct value counts array'); 

        test.done();
    };

    exports[testPrefix + ' - Data'] = function(test) {
        var numVars = px.variables().length;
        var lastDatumIdx = _.map(px.valCounts(), function(d) { return d - 1; });
        var midDatumIdx = _.map(px.valCounts(), function(d) {return Math.floor(d/2); });
        var entries = px.entries();

        var firstEntry = {};
        var lastEntry = {};

        (function() {
            for (var varNum = 0; varNum < numVars; varNum++) {
                var varName = testData[i].varNames[varNum];
                firstEntry[varName] = testData[i].firstMidLastVals[varNum][0];
                lastEntry[varName] = testData[i].firstMidLastVals[varNum][2];
            }
            firstEntry.num = testData[i].firstMidLastZeroData[0][0];
            lastEntry.num = testData[i].firstMidLastMaxData[0][2];
        }());


        test.expect(6 + (numVars * 16));

        // Px.data()
        test.equal(_.size(px.data), testData[i].numData, 'Correct number of data points');

        
        // Px.datum()
        test.equal(px.datum(arrayOfZeroes(px.variables().length)), 
                   testData[i].firstDatum, 'Correct value for first data point');

        test.equal(px.datum(lastDatumIdx), testData[i].lastDatum,
                   'Correct value for last data point');

        test.equal(px.datum(midDatumIdx), testData[i].midDatum,
                   'Correct value for middle data point (' + midDatumIdx + ')');



        (function(){
            for (var varNum = 0; varNum < numVars; varNum++) {
                var zeroArray = arrayOfZeroes(px.variables().length);
                zeroArray.splice(varNum, 1, '*');
                var zeroDataCol = px.dataCol(zeroArray);

                var maxArray = _.map(px.valCounts(), function(d) {return d-1;});
                var maxIdx = maxArray.splice(varNum, 1, '*');
                var maxDataCol = px.dataCol(maxArray);
                var midIdx = Math.floor(maxDataCol.length / 2);
                var zeroDataDict = px.dataDict(zeroArray);
                var maxDataDict = px.dataDict(maxArray);

                // Px.dataCol()
                test.equal(zeroDataCol.length, testData[i].numVals[varNum],
                           'Correct number of values returned for zero-based dataCol');
                test.equal(maxDataCol.length, testData[i].numVals[varNum],
                           'Correct number of values returned for maximum-based dataCol');

                test.equal(zeroDataCol[0], testData[i].firstMidLastZeroData[varNum][0],
                           'Correct first value on zero-based dataCol'); 
                test.equal(maxDataCol[0], testData[i].firstMidLastMaxData[varNum][0],
                           'Correct first value on maximum-based dataCol');

                test.equal(zeroDataCol[midIdx], testData[i].firstMidLastZeroData[varNum][1],
                           'Correct middle value on zero-based dataCol'); 
                test.equal(maxDataCol[midIdx], testData[i].firstMidLastMaxData[varNum][1],
                           'Correct middle value on maximum-based dataCol'); 

                test.equal(zeroDataCol[maxIdx], testData[i].firstMidLastZeroData[varNum][2],
                           'Correct last value on zero-based dataCol'); 
                test.equal(maxDataCol[maxIdx], testData[i].firstMidLastMaxData[varNum][2],
                           'Correct last value on maximum-based dataCol');


                // Px.dataDict()
                test.equal(_.size(zeroDataDict), testData[i].numVals[varNum],
                           'Correct number of kv pairs returned for zero-based dataDict');
                test.equal(_.size(maxDataDict), testData[i].numVals[varNum],
                           'Correct number of kv pairs returned for maximum-based dataDict');

                test.equal(zeroDataDict[testData[i].firstMidLastCodes[varNum][0]], 
                           testData[i].firstMidLastZeroData[varNum][0],
                           'Correct value from first code on zero-based dataDict'); 
                test.equal(maxDataDict[testData[i].firstMidLastCodes[varNum][2]], 
                           testData[i].firstMidLastMaxData[varNum][2],
                           'Correct value from first code on maximum-based dataDict');

                test.equal(zeroDataDict[testData[i].firstMidLastCodes[varNum][1]], 
                           testData[i].firstMidLastZeroData[varNum][1],
                           'Correct value from middle code on zero-based dataDict'); 
                test.equal(maxDataDict[testData[i].firstMidLastCodes[varNum][2]], 
                           testData[i].firstMidLastMaxData[varNum][2],
                           'Correct value from middle code on maximum-based dataDict'); 

                test.equal(zeroDataDict[testData[i].firstMidLastCodes[varNum][2]], 
                           testData[i].firstMidLastZeroData[varNum][2],
                           'Correct value from last code on zero-based dataDict'); 
                test.equal(maxDataDict[testData[i].firstMidLastCodes[varNum][2]], 
                           testData[i].firstMidLastMaxData[varNum][2],
                           'Correct value from last code on maximum-based dataDict');


            }
        }());


	// Px.entries()
        test.deepEqual(entries[0], firstEntry, 'Correct first entry for Px.entries()');
        test.deepEqual(entries[testData[i].numData - 1], lastEntry, 'Correct first entry for Px.entries()');


	// Px.truncate()
	// truncate tests must be run last as they alter the Px object
	
        test.done();
    };

};

for (var i = 0; i < numTestCases; i++) {
    runTests(i);
}
