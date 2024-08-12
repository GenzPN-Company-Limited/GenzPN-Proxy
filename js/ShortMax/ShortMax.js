/**
 * Quantumult X script to modify URL path segments from _720 or _480 to _1080
 */

// Function to modify the URL
function modifyUrl(url) {
    // Replace _720 or _480 with _1080
    return url.replace(/(_720|_480)/, '_1080');
}

// Get the current request URL
let url = $request.url;

// Modify the URL
let modifiedUrl = modifyUrl(url);

// Log for debugging
console.log("Original URL: " + url);
console.log("Modified URL: " + modifiedUrl);

// Rebuild the request with the modified URL
const myRequest = {
    url: modifiedUrl,
    method: $request.method,
    headers: $request.headers,
    body: $request.body
};

// Send the modified request
$task.fetch(myRequest).then(response => {
    // Return the response to the original request
    $done(response);
}, reason => {
    // Handle any errors
    console.log("Error: " + reason.error);
    $done();
});
