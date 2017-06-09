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
// text api
const getExpertTextBtn = document.getElementById('text-expert-get');
const getTextBtn = document.getElementById('text-get');
const setTextLen = document.getElementById('text-set-len');
const inputTextLen = document.getElementById('text-len-num');
// result area
const resRgx = document.getElementById('result-rgx');
const resNum = document.getElementById('result-num');
const resDiv = document.getElementById('result-text');

// proxy to bypass CORS errors
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

// variables
var themeHref = document.getElementById('theme');

// indicators for the result text
var iStart = "<strong>";
var iEnd = "</strong>";

// insert into string
String.prototype.insert = function(idx, rem, str) {
	return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

// execute regex
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
	
	// set cookies
	setCookie('rgx', rgxInput.value);
	setCookie('args', args);

	if (!rgxArgGlobal.checked) {
		var o = 0; // offset
		if ((match = t.match(r)) != null) {
			result = result.insert(o + match.index, 0, iStart);
			o+=iStart.length;
			result = result.insert((o + match.index + match[0].length), 0, iEnd);
			o+=iEnd.length;
			resNum.innerHTML = '- match found';
		}
		else {
			resNum.innerHTML = ' - no matches';
		}
		resRgx.innerHTML = r;
		resDiv.innerHTML = result;
		return true;
	}
	else {
		var o = 0; // offset
		var c = 0; // result counter
		while ((match = r.exec(t)) != null) {
			c++;
			result = result.insert(o + match.index, 0, iStart);
			o+=iStart.length;
			result = result.insert((o + match.index + match[0].length), 0, iEnd);
			o+=iEnd.length;
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

// put Bacon Ipsum into the textarea
function getText() {
	// create reader to get text from the response blob
	var reader = new FileReader();
	reader.onload = function() {
		textInput.value = reader.result;
	}
	// fetch paragraphs
	fetch('https://baconipsum.com/api/?type=meat-and-filler&start-with-lorem=1&paras='+setTextLen.value+'&format=text')
		.then(response => response.blob())
		.then(blob => reader.readAsText(blob));
	setCookie('bacon', setTextLen.value);
	setCookie('text', 'bacon');
}
function setTextLength() {
	if (setTextLen.value > 1) inputTextLen.innerHTML = setTextLen.value + " bacons";
	else { inputTextLen.innerHTML = setTextLen.value + " bacon"; }
}
// put expert text into the textarea
function getExpertText() {
	// create reader to get text from the response blob
	var reader = new FileReader();
	reader.onload = function() {
		textInput.value = reader.result;
	}
	// fetch paragraphs
	fetch(corsProxy + 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=json&rvprop=content&generator=random&grnnamespace=0&grnlimit=1')
		.then(response => response.blob())
		.then(blob => reader.readAsText(blob));
	setCookie('bacon', setTextLen.value);
	setCookie('text', 'expert');
}

function changeTheme() {
	if(!themeHref.href.match(/dark.css/)) {
		themeHref.href = 'css/dark.css';
		setCookie('theme', 'dark');
	}
	else {
		themeHref.href = 'css/light.css';
		setCookie('theme', 'light');
	}
}

// cookie functions
function setCookie(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name) {
	setCookie(name,"",-1);
}

// get cookies & set preferences
function getPrefs() {
	themeHref.href = 'css/' + readCookie('theme') + '.css';
	setTextLen.value = readCookie('bacon');
	rgxInput.value = readCookie('rgx');
	if(readCookie('args').match(/g/)) rgxArgGlobal.checked = true;
	if(readCookie('args').match(/i/)) rgxArgCase.checked = true;
	if(readCookie('args').match(/m/)) rgxArgMultiLine.checked = true;
	if(readCookie('args').match(/u/)) rgxArgUnicode.checked = true;
	if(readCookie('text') == 'bacon') {
		getText();
	} else getExpertText();
}

// event listeners
getExpertTextBtn.addEventListener('click', getExpertText);
getTextBtn.addEventListener('click', getText);
setTextLen.addEventListener('input', setTextLength);
changeThemeBtn.addEventListener('click', changeTheme);
executeBtn.addEventListener('click', testRegEx);
rgxInput.addEventListener("keypress", function(e) {
	if (e.keyCode == 13)
		testRegEx(e);
});

/*
// test in console:
var re = /bar/g,
	str = "foobarfoobar";
while ((match = re.exec(str)) != null) {
	console.log("match found at " + match.index +': '+ str.substring(match.index, match.index+match[0].length));
}
*/

(function(){
	getPrefs();
	setTextLength();
})();