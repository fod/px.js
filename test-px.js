$(function() {

    $('#pxfile').bind('change', handlePxfile);

    window.xxx = {};
    function handlePxfile() {
	var reader = new FileReader();
	var file = this.files[0].name.replace('.px', '');
	reader.readAsText(this.files[0]);
	reader.onload = function() { return xxx[file] = new Px(reader.result); }
    }

});

