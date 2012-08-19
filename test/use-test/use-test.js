//$(function() {

    document.getElementById('pxfile').onchange = handlePxfile;

    var px = {};
    function handlePxfile() {

    	var reader = new FileReader();
    	var file = this.files[0].name.replace('.px', '');

    	reader.onload = function() { return px[file] = new Px(reader.result); };
    	reader.onerror = function () {
    	    console.log('FileReader error loading: ' + file + '.px. Are you running your app from file:// ? FileReader API does not allow running from file:// for security reasons. See https://developer.mozilla.org/en/DOM/File_API/File_System_API/FileError for more information.');
    	};
    	reader.readAsText(this.files[0], 'cp1251');
    }
//});


// var xhr = new XMLHttpRequest();

// xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4 && xhr.status === 200) {
// 	console.log(xhr.responseText);
// 	var px = new Px(xhr.responseText);
//     }
// };

// xhr.open('GET', '../testData/VSA31.px');
// xhr.send();


