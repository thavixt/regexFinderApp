var inputRgx = document.getElementById('regex-input');
var btn = document.getElementById('test-btn');
var inputText = document.getElementById('test-text');
var resRgx = document.getElementById('result-regex');
var resNum = document.getElementById('result-num');
var resDiv = document.getElementById('result-text');

// indicators for the result text
var iStart = "<strong>";
var iEnd = "</strong>";

btn.addEventListener('click', testRegEx);

function testRegEx() {
	var r = new RegExp(inputRgx.value,'g');
	var t = inputText.value;
	var result = t;

	var i = 0;
	var m = 0;
	while ((match = r.exec(t)) != null) {
		m++;
		//console.log("match found at " + match.index +': '+ t.substring(match.index, match.index+match[0].length));
		result = result.insert(i + match.index, 0, iStart); i+=8;
		result = result.insert((i + match.index + match[0].length), 0, iEnd); i+=9;
	}
	
	if(m==0) {
		resNum.innerHTML = ' - no matches';
	} else if (m==1) {
		resNum.innerHTML = ' - ' + m + ' match';
	} else {
		resNum.innerHTML = ' - ' + m + ' matches';
	}
	resRgx.innerHTML = r;
	resDiv.innerHTML = result;
}

String.prototype.insert = function(idx, rem, str) {
	return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


/*
// test in console:
var re = /bar/g,
	str = "foobarfoobar";
while ((match = re.exec(str)) != null) {
	console.log("match found at " + match.index +': '+ str.substring(match.index, match.index+match[0].length));
}
*/