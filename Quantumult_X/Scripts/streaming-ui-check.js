const BASE_URL = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_DISNEY = 'https://www.disneyplus.com';
const BASE_URL_Dazn = "https://startup.core.indazn.com/misl/v5/Startup";
const BASE_URL_Param = "https://www.paramountplus.com/"
const FILM_ID = 81280792
const BASE_URL_Discovery_token = "https://us1-prod-direct.discoveryplus.com/token?deviceId=d1a4a5d25212400d1e6985984604d740&realm=go&shortlived=true"
const BASE_URL_Discovery = "https://us1-prod-direct.discoveryplus.com/users/me"
const BASE_URL_GPT = 'https://chat.openai.com/'
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'

const STATUS_COMING = 2;
const STATUS_AVAILABLE = 1;
const STATUS_NOT_AVAILABLE = 0;
const STATUS_TIMEOUT = -1;
const STATUS_ERROR = -2;

var opts = {
  policy: $environment.params
};

var opts1 = {
  policy: $environment.params,
  redirection: false
};

var flags = new Map([
  ["US", "🇺🇸"], ["UK", "🇬🇧"], ["JP", "🇯🇵"], ["FR", "🇫🇷"], ["DE", "🇩🇪"], ["IT", "🇮🇹"], ["ES", "🇪🇸"], ["CN", "🇨🇳"], ["KR", "🇰🇷"], ["RU", "🇷🇺"]
]);

let result = {
  "title": '📺 Streaming Service Check',
  "YouTube": '<b>YouTube: </b>Test failed, please try again ❗️',
  "Netflix": '<b>Netflix: </b>Test failed, please try again ❗️',
  "Dazn": "<b>Dazn: </b>Test failed, please try again ❗️",
  "Disney": "<b>Disney+: </b>Test failed, please try again ❗️",
  "Paramount": "<b>Paramount+: </b>Test failed, please try again ❗️",
  "Discovery": "<b>Discovery+: </b>Test failed, please try again ❗️',
  "ChatGPT": "<b>ChatGPT: </b>Test failed, please try again ❗️"
};

(async () => {
  await testYTB();
  await testDazn();
  await testParam();
  await testNf(FILM_ID);
  await testDiscovery();
  await testChatGPT();
  let { region, status } = await testDisneyPlus();

  if (status == STATUS_COMING) {
    result["Disney"] = "<b>Disney+: </b>Upcoming ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ ⚠️";
  } else if (status == STATUS_AVAILABLE) {
    result["Disney"] = "<b>Disney+: </b>Available ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ 🎉";
  } else if (status == STATUS_NOT_AVAILABLE) {
    result["Disney"] = "<b>Disney+: </b>Not available ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ 🚫";
  } else if (status == STATUS_TIMEOUT) {
    result["Disney"] = "<b>Disney+: </b>Timeout ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ ⏳";
  } else if (status == STATUS_ERROR) {
    result["Disney"] = "<b>Disney+: </b>Error ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ ❗️";
  }

  console.log("Results: " + JSON.stringify(result));
  updateResultOnScreen(result);
})();

async function testYTB() {
  try {
    let response = await fetch(BASE_URL_YTB, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    if (response.status === 200) {
      result["YouTube"] = '<b>YouTube: </b>Available 🎉';
    } else {
      result["YouTube"] = '<b>YouTube: </b>Not available 🚫';
    }
  } catch (error) {
    console.error("Error testing YouTube:", error);
    result["YouTube"] = '<b>YouTube: </b>Error ❗️';
  }
}

async function testDazn() {
  try {
    let response = await fetch(BASE_URL_Dazn, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    if (response.status === 200) {
      result["Dazn"] = '<b>Dazn: </b>Available 🎉';
    } else {
      result["Dazn"] = '<b>Dazn: </b>Not available 🚫';
    }
  } catch (error) {
    console.error("Error testing Dazn:", error);
    result["Dazn"] = '<b>Dazn: </b>Error ❗️';
  }
}

async function testParam() {
  try {
    let response = await fetch(BASE_URL_Param, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    if (response.status === 200) {
      result["Paramount"] = '<b>Paramount+: </b>Available 🎉';
    } else {
      result["Paramount"] = '<b>Paramount+: </b>Not available 🚫';
    }
  } catch (error) {
    console.error("Error testing Paramount:", error);
    result["Paramount"] = '<b>Paramount+: </b>Error ❗️';
  }
}

async function testDisneyPlus() {
  try {
    let response = await fetch(BASE_URL_DISNEY, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    let status;
    if (response.status === 200) {
      status = STATUS_AVAILABLE;
    } else if (response.status === 403) {
      status = STATUS_COMING;
    } else if (response.status === 404) {
      status = STATUS_NOT_AVAILABLE;
    } else if (response.status === 408) {
      status = STATUS_TIMEOUT;
    } else {
      status = STATUS_ERROR;
    }
    return { region: "US", status: status };
  } catch (error) {
    console.error("Error testing Disney Plus:", error);
    return { region: "US", status: STATUS_ERROR };
  }
}

async function testNf(id) {
  try {
    let response = await fetch(BASE_URL + id, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    if (response.status === 200) {
      result["Netflix"] = '<b>Netflix: </b>Available 🎉';
    } else {
      result["Netflix"] = '<b>Netflix: </b>Not available 🚫';
    }
  } catch (error) {
    console.error("Error testing Netflix:", error);
    result["Netflix"] = '<b>Netflix: </b>Error ❗️';
  }
}

async function testDiscovery() {
  try {
    let response = await fetch(BASE_URL_Discovery_token, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    let data = await response.json();
    if (response.status === 200 && data.access_token) {
      result["Discovery"] = '<b>Discovery+: </b>Available 🎉';
    } else {
      result["Discovery"] = '<b>Discovery+: </b>Not available 🚫';
    }
  } catch (error) {
    console.error("Error testing Discovery+:", error);
    result["Discovery"] = '<b>Discovery+: </b>Error ❗️';
  }
}

async function testChatGPT() {
  try {
    let response = await fetch(BASE_URL_GPT, {
      method: 'GET',
      headers: { 'User-Agent': UA }
    });
    if (response.status === 200) {
      result["ChatGPT"] = '<b>ChatGPT: </b>Available 🎉';
    } else {
      result["ChatGPT"] = '<b>ChatGPT: </b>Not available 🚫';
    }
  } catch (error) {
    console.error("Error testing ChatGPT:", error);
    result["ChatGPT"] = '<b>ChatGPT: </b>Error ❗️';
  }
}

function updateResultOnScreen(result) {
  // Implement the logic to update the result on the screen
}
