const BASE_URL = 'https://www.netflix.com/title/'; // Replace with your actual base URL
const FILM_ID = '81280792'; // Replace with your actual film ID
const BASE_URL_YTB = 'https://www.youtube.com/premium'; // Replace with your actual YouTube base URL
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'; // Replace with your actual ChatGPT region URL
const opts = {}; // Add any necessary options here
const arrow = ' -> '; // Or any other symbol you want to use
const flags = new Map(); // Define your flags map

flags.set('US', 'United States');
flags.set('VN', 'Vietnam');
// Add more flags as needed

async function httpAPI(url, method, body, opts) {
  // Your implementation of httpAPI here
  // It should return a response object with statusCode, headers, and body
}

async function checkNetflix() {
  try {
    let response = await httpAPI(BASE_URL + FILM_ID, 'GET', null, opts);
    console.log("Netflix Response:", response);
    if (response.statusCode === 200) {
      let url = response.headers['x-originating-url'];
      let region = url.split('/')[3];
      region = region === 'title' ? 'us' : region;
      let full_region = flags.get(region.toUpperCase()) ?? "Unknown Region";
      return "Netflix: " + full_region.toUpperCase() + arrow + "Unlocked ✔";
    } else if (response.statusCode === 403) {
      return "Netflix: Cannot use Netflix";
    } else {
      return "Netflix: Check failed";
    }
  } catch (error) {
    console.error("Netflix Error:", error);
    return "Netflix: Check failed";
  }
}

async function checkYT() {
  try {
    let response = await httpAPI(BASE_URL_YTB, 'GET', null, opts);
    console.log("YouTube Response:", response);
    if (response.statusCode === 200) {
      let region = response.headers['x-originating-url'].split('/')[3];
      let full_region = flags.get(region.toUpperCase()) ?? "Unknown Region";
      return "YouTube Premium: " + full_region.toUpperCase() + arrow + "Unlocked ✔";
    } else if (response.statusCode === 403) {
      return "YouTube Premium: Cannot use YouTube Premium";
    } else {
      return "YouTube Premium: Check failed";
    }
  } catch (error) {
    console.error("YouTube Error:", error);
    return "YouTube Premium: Check failed";
  }
}

async function checkGPT() {
  try {
    let response = await httpAPI(Region_URL_GPT, 'GET', null, opts);
    console.log("ChatGPT Response:", response);
    let region = response.body.split("loc=")[1].split("\n")[0];
    let full_region = flags.get(region.toUpperCase()) ?? "Unknown Region";
    return "ChatGPT: " + full_region.toUpperCase() + arrow + "Unlocked ✔";
  } catch (error) {
    console.error("ChatGPT Error:", error);
    return "ChatGPT: Check failed";
  }
}

// Function to check all streaming services and display the results
async function checkAllStreamingServices() {
  let results = [];
  results.push(await checkNetflix());
  results.push(await checkYT());
  results.push(await checkGPT());

  // Display results in an alert dialog
  let message = results.join("\n");
  console.log("Streaming - Unlock Status:", message);
  alert(message);
}

// Call the function to check all streaming services
checkAllStreamingServices();