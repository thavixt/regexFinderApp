// form
const rgxForm = document.getElementById('rgx-form');
const rgxInput = document.getElementById('rgx-input');
const rgxInfo = document.getElementById('rgx-info');
const textInput = document.getElementById('rgx-text');
// arguments
const rgxArgGlobal = document.getElementById('rgx-arg-g');
const rgxArgCase = document.getElementById('rgx-arg-i');
const rgxArgMultiLine = document.getElementById('rgx-arg-m');
const rgxArgUnicode = document.getElementById('rgx-arg-u');
// result
const resRgx = document.getElementById('result-rgx');
const resNum = document.getElementById('result-num');
const resDiv = document.getElementById('result-text');

// indicators for the result text
var iStart = "<strong>";
var iEnd = "</strong>";

rgxForm.addEventListener('submit', testRegEx);

function testRegEx(e) {
	e.preventDefault();
	
	// prevent infinite loop
	if (rgxInput.value == '') {
		rgxInput.classList.add("warning");
		rgxInfo.innerHTML = 'invalid expression';
		resRgx.innerHTML = '';
		resDiv.innerHTML = '';
		return false;
	}
	rgxInput.classList.remove("warning");
	rgxInfo.innerHTML = '';
	
	// gather checked flags
	var args = "g";
	if (rgxArgCase.checked) { args += 'i' }
	if (rgxArgMultiLine.checked) { args += 'm' }
	if (rgxArgUnicode.checked) { args += 'u' }
	
	// create regular expression from input
	var r = new RegExp(rgxInput.value, args);
	console.log(r);
	
	// read textarea
	var t = textInput.value;
	var result = t;

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

(function(){
	textInput.value = 'Nunc eget est porta, aliquam orci ac, venenatis nisi. Pellentesque sodales volutpat pharetra. Pellentesque cursus nisl eget dui volutpat dignissim. Integer eu efficitur ex. Nullam quis nunc ac urna scelerisque iaculis. Fusce neque augue, blandit ac felis ac, semper fermentum nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In non orci a nisl placerat viverra. Duis nunc purus, auctor in est nec, cursus tempus quam. In suscipit luctus congue.\r\n\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.\r\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\r\n\n- http://www.lipsum.com/';
	rgxInput.value = 'lorem';
})();