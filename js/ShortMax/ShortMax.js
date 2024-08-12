/**
 * Quantumult X script to transform video stream URLs
 */

// This function modifies the requested URL
const modifyUrl = (url) => {
    // Regular expression to match _720 or _480 and replace with _1080
    return url.replace(/(_720|_480)/, '_1080');
  };
  
  // Capture the request URL
  let url = $request.url;
  
  // Transform the URL
  let modifiedUrl = modifyUrl(url);
  
  // Log the original and modified URLs (for debugging purposes)
  console.log("Original URL: ", url);
  console.log("Modified URL: ", modifiedUrl);
  
  // Complete the request with the modified URL
  $done({ url: modifiedUrl });
  