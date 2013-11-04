var keystr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
function encode(ch) {
	return String.fromCharCode(keystr.charCodeAt(ch))
}
function decode(ch) {
	return keystr.indexOf((ch))
}
function compress(str) {
	// Build the dict.
	var i,
		dict = {},
		c,
		wc,
		w = "",
		result = [],
		dictSize = 256,
		d = (str + "").split("");
	
	for (i = 0; i < 256; i += 1) {
		dict[String.fromCharCode(i)] = i;
	}

	for (i = 0; i < d.length; i += 1) {
		c = d[i];
		wc = w + c;
		//Do not use dict[wc] because javascript arrays 
		//will return values for array['pop'], array['push'] etc
		// if (dict[wc]) {
		if (dict.hasOwnProperty(wc)) {
			w = wc;
		} else {
			// result.push(dict[w]);
			result.push(encode(dict[w] & 63));
			result.push(encode((dict[w] >> 6) & 63));
			// Add wc to the dict.
			if(dictSize<4096)
				dict[wc] = dictSize++;
			w = String(c);
		}
	}

	// Output the code for w.
	if (w !== "") {
		// result.push(dict[w]);
		result.push(encode(dict[w] & 63));
		result.push(encode((dict[w] >> 6) & 63));
	}
	// alert(dictSize + ' utf:' + c1 + ' bit:' + c2);
	return result.join("");
}
function decompress(compressed) {
	// Build the dictionary.
	var i,
		dictionary = [],
		w,
		result = [],
		k,
		entry = "",
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[i] = String.fromCharCode(i);
	}

	w = String.fromCharCode(decode(compressed[0]) | (decode(compressed[1]) << 6));
	result.push(w);
	for (i = 2; i < compressed.length; i += 2) {
		k = decode(compressed[i]) | (decode(compressed[i+1]) << 6);
		// alert(k);
		if (dictionary[k]) {
			entry = dictionary[k];
		} else {
			if (k === dictSize) {
				entry = w + w.charAt(0);
			} else {
				return null;
			}
		}

		result.push(entry);

		// Add w+entry[0] to the dictionary.
		if(dictSize<4096)
			dictionary[dictSize++] = w + entry.charAt(0);

		w = entry;
	}
	return result.join("");
}

function upd()
{
	var area = document.getElementById('code');
	var teststr = area.value;
	var compressed = compress(teststr);
	document.getElementById('result').value = decompress(compressed);
	document.getElementById('ratio').innerHTML = 'Before:' + teststr.length + ', after: ' + compressed.length
}

window.onload = function () 
{
	var area = document.getElementById('code');
	area.onkeyup = upd;
	upd();
}