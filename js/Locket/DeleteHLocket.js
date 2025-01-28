// ========= Delete Header Logic ========= //
/***********************************************
> deleteHeader by Ohoang7
***********************************************/

const version = 'V1.0.2';

function setHeaderValue(headers, key, value) {
  var lowerKey = key.toLowerCase();
  if (lowerKey in headers) {
    headers[lowerKey] = value;
  } else {
    headers[key] = value;
  }
}

var modifiedHeaders = $request.headers;
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");

$done({
  headers: modifiedHeaders
});