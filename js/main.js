// form
const rgxInput = document.getElementById('rgx-input');
const rgxInfo = document.getElementById('rgx-input-info');
const textInput = document.getElementById('text');
const textInfo = document.getElementById('text-info');
// arguments
const rgxArgGlobal = document.getElementById('rgx-arg-g');
const rgxArgCase = document.getElementById('rgx-arg-i');
const rgxArgMultiLine = document.getElementById('rgx-arg-m');
const rgxArgUnicode = document.getElementById('rgx-arg-u');
// buttons
const executeBtn = document.getElementById('rgx-submit');
const changeThemeBtn = document.getElementById('change-theme-btn');
// bacon
var getBaconBtn = document.getElementById('text-bacon');
const setBaconLen = document.getElementById('text-bacon-len');
const baconLenNum = document.getElementById('text-bacon-len-num');
// result area
const resRgx = document.getElementById('result-rgx');
const resNum = document.getElementById('result-num');
const resDiv = document.getElementById('result-text');

// variables
var themeHref = document.getElementById('theme');
var theme = true;
var bacon = setBaconLen.value;

// indicators for the result text
var iStart = "<strong>";
var iEnd = "</strong>";

function testRegEx(e) {
	e.preventDefault();
	
	// if pattern is empty
	if (rgxInput.value == '') {
		rgxInput.classList.add("warning");
		rgxInfo.innerHTML = 'invalid expression!';
		resRgx.innerHTML = '';
		resDiv.innerHTML = '';
		console.log("empty input");
		return false;
	}
	// if textarea is empty
	if (textInput.value == "") {
		textInput.classList.add("warning");
		textInfo.innerHTML = 'textarea is empty!';
		resRgx.innerHTML = '';
		resDiv.innerHTML = '';
		console.log("empty textarea");
		return false;
	}
	// else clear warnings
	rgxInput.classList.remove("warning");
	rgxInfo.innerHTML = '';
	textInput.classList.remove("warning");
	textInfo.innerHTML = '';
	
	// gather checked flags
	var args = '';
	if (rgxArgGlobal.checked) { args += 'g' }
	if (rgxArgCase.checked) { args += 'i' }
	if (rgxArgMultiLine.checked) { args += 'm' }
	if (rgxArgUnicode.checked) { args += 'u' }
	
	// create regular expression from input
	var r = new RegExp(rgxInput.value, args);
	console.log(r);
	
	// read textarea
	var t = textInput.value;
	var result = t;

	if (!rgxArgGlobal.checked) {

		resNum.innerHTML = '- 1 match';
		return true;
	}
	else {
		var o = 0; // offest
		var c = 0; // result counter
		while ((match = r.exec(t)) != null) {
			c++;
			//console.log("match found at " + match.index +': '+ t.substring(match.index, match.index+match[0].length));
			result = result.insert(o + match.index, 0, iStart); o+=8;
			result = result.insert((o + match.index + match[0].length), 0, iEnd); o+=9;
		}
		
		if(c==0) {
			resNum.innerHTML = ' - no matches';
		} else if (c==1) {
			resNum.innerHTML = ' - ' + c + ' match';
		} else {
			resNum.innerHTML = ' - ' + c + ' matches';
		}
		
		resRgx.innerHTML = r;
		resDiv.innerHTML = result;
		return true;
	}
	
}

String.prototype.insert = function(idx, rem, str) {
	return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

// put Bacon Ipsum into the textarea
function getBacon(e) {
	e.preventDefault();
	getBaconBtn.innerHTML = "serving bacon ... ";
	// create reader to get text from the response blob
	var reader = new FileReader();
	reader.onload = function() {
		getBaconBtn.innerHTML = "Give me a new bacon";
		textInput.value = reader.result;
	}
	// fetch paragraphs
	fetch('https://baconipsum.com/api/?type=meat-and-filler&start-with-lorem=1&paras='+bacon+'&format=text')
	.then(response => response.blob())
	.then(blob => reader.readAsText(blob))
}
function setBaconLength() {
	bacon = setBaconLen.value;
	if (bacon > 1) baconLenNum.innerHTML = bacon + " bacons";
	else { baconLenNum.innerHTML = bacon + " bacons"; }
}

function changeTheme() {
	if(theme) {
		themeHref.href = 'css/dark.css';
		theme = false;
	}
	else {
		themeHref.href = 'css/light.css';
		theme = true;
	}
	console.log('theme changed');
}

// event listeners
executeBtn.addEventListener('click', testRegEx);
getBaconBtn.addEventListener('click', getBacon);
setBaconLen.addEventListener('input', setBaconLength);
changeThemeBtn.addEventListener('click', changeTheme);

/*
// test in console:
var re = /bar/g,
	str = "foobarfoobar";
while ((match = re.exec(str)) != null) {
	console.log("match found at " + match.index +': '+ str.substring(match.index, match.index+match[0].length));
}
*/

(function(){
	setBaconLength();
})();