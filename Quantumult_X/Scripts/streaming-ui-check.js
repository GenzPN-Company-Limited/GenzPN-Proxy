/***

Thanks to & modified from 
1. https://gist.githubusercontent.com/Hyseen/b06e911a41036ebc36acf04ddebe7b9a/raw/nf_check.js
2. https://github.com/AtlantisGawrGura/Quantumult-X-Scripts/blob/main/media.js
3. https://github.com/CoiaPrant/MediaUnlock_Test/blob/main/check.sh
4. https://github.com/Netflixxp/chatGPT/blob/main/chat.sh

For Quantumult-X 598+ ONLY!!

2023-02-14

- Supports ChatGPT detection

[task_local]

event-interaction https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js, tag=Streaming-Unlock-Check, img-url=checkmark.seal.system, enabled=true

Thanks @XIAO_KOP

**/

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

const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" } 
const policy_name = "Netflix" // Enter your Netflix policy group name here

const arrow = " ➟ "

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'

// Status codes
const STATUS_COMING = 2; // Upcoming
const STATUS_AVAILABLE = 1; // Available
const STATUS_NOT_AVAILABLE = 0; // Not available
const STATUS_TIMEOUT = -1; // Timeout
const STATUS_ERROR = -2; // Error

var opts = {
  policy: $environment.params
};

var opts1 = {
  policy: $environment.params,
  redirection: false
};

var flags = new Map([
  ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"],
  ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧🇫"], ["BG", "🇧🇬"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧🇲"], ["BN", "🇧🇳"], ["BO", "🇧🇴"], ["BR", "🇧🇷"], ["BS", "🇧🇸"], ["BT", "🇧🇹"], ["BV", "🇧🇻"], ["BW", "🇧🇼"], ["BY", "🇧🇾"], ["BZ", "🇧🇿"],
  ["CA", "🇨🇦"], ["CF", "🇨🇫"], ["CH", "🇨🇭"], ["CK", "🇨🇰"], ["CL", "🇨🇱"], ["CM", "🇨🇲"], ["CN", "🇨🇳"], ["CO", "🇨🇴"], ["CP", "🇨🇵"], ["CR", "🇨🇷"], ["CU", "🇨🇺"], ["CV", "🇨🇻"], ["CW", "🇨🇼"], ["CX", "🇨🇽"], ["CY", "🇨🇾"], ["CZ", "🇨🇿"], ["DE", "🇩🇪"], ["DG", "🇩🇬"], ["DJ", "🇩🇯"], ["DK", "🇩🇰"], ["DM", "🇩🇲"], ["DO", "🇩🇴"], ["DZ", "🇩🇿"], ["EA", "🇪🇦"], ["EC", "🇪🇨"], ["EE", "🇪🇪"], ["EG", "🇪🇬"], ["EH", "🇪🇭"], ["ER", "🇪🇷"], ["ES", "🇪🇸"], ["ET", "🇪🇹"], ["EU", "🇪🇺"], ["FI", "🇫🇮"], ["FJ", "🇫🇯"], ["FK", "🇫🇰"], ["FM", "🇫🇲"], ["FO", "🇫"], ["FR", "🇫🇷"], ["GA", "🇬🇦"], ["GB", "🇬🇧"], ["HK", "🇭🇰"], ["HU", "🇭🇺"], ["ID", "🇮🇩"], ["IE", "🇮🇪"], ["IL", "🇮🇱"], ["IM", "🇮🇲"], ["IN", "🇮🇳"], ["IS", "🇮🇸"], ["IT", "🇮🇹"], ["JP", "🇯🇵"], ["KR", "🇰🇷"], ["LU", "🇱🇺"], ["MO", "🇲🇴"], ["MX", "🇲🇽"], ["MY", "🇲🇾"], ["NL", "🇳🇱"], ["PH", "🇵🇭"], ["RO", "🇷🇴"], ["RS", "🇷🇸"], ["RU", "🇷🇺"], ["RW", "🇷🇼"], ["SA", "🇸🇦"], ["SB", "🇧"], ["SC", "🇸🇨"], ["SD", "🇸🇩"], ["SE", "🇸🇪"], ["SG", "🇸🇬"], ["TH", "🇹🇭"], ["TN", "🇹🇳"], ["TO", "🇹🇴"], ["TR", "🇹🇷"], ["TV", "🇹🇻"], ["TW", "🇨🇳"], ["UK", "🇬🇧"], ["UM", "🇺🇲"], ["US", "🇺🇸"], ["UY", "🇺🇾"], ["UZ", "🇺🇿"], ["VA", "🇻🇦"], ["VE", "🇻🇪"], ["VG", "🇻🇬"], ["VI", "🇻🇮"], ["VN", "🇻🇳"], ["ZA", "🇿🇦"]
]);

let result = {
  "title": '📺 Streaming Service Check',
  "YouTube": '<b>YouTube: </b>Test failed, please try again ❗️',
  "Netflix": '<b>Netflix: </b>Test failed, please try again ❗️',
  "Dazn": "<b>Dazn: </b>Test failed, please try again ❗️",
  "Disney": "<b>Disney+: </b>Test failed, please try again ❗️",
  "Paramount": "<b>Paramount+: </b>Test failed, please try again ❗️",
  "Discovery": "<b>Discovery+: </b>Test failed, please try again ❗️",
  "ChatGPT": "<b>ChatGPT: </b>Test failed, please try again ❗️"
}

const message = {
  action: "get_policy_state",
  content: $environment.params
};

;(async () => {
  testYTB();
  testDazn();
  testParam();
  let [{ region, status }] = await Promise.all([testDisneyPlus(), testNf(FILM_ID), testDiscovery(), testChatGPT()]);
  console.log("NetFlix Result:" + result["Netflix"]);
  console.log(`testDisneyPlus: region=${region}, status=${status}`);
  
  if (status == STATUS_COMING) {
    result["Disney"] = "<b>Disney+: </b>Upcoming ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ ⚠️";
  } else if (status == STATUS_AVAILABLE) {
    result["Disney"] = "<b>Disney+: </b>Available ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ 🎉";
    console.log(result["Disney"]);
  } else if (status == STATUS_NOT_AVAILABLE) {
    result["Disney"] = "<b>Disney+: </b>Not available ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ 🚫";
  } else if (status == STATUS_TIMEOUT) {
    result["Disney"] = "<b>Disney+: </b>Timeout ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ ⏳";
  } else if (status == STATUS_ERROR) {
    result["Disney"] = "<b>Disney+: </b>Error ➟ " + '⟦' + flags.get(region.toUpperCase()) + "⟧ ❗️";
  }

  // Log all results
  console.log("Results: " + JSON.stringify(result));

  // Update the result on screen
  updateResultOnScreen(result);
})();

async function testYTB() {
  let response = await fetch(BASE_URL_YTB, {
    method: 'GET',
    headers: {
      'User-Agent': UA
    }
  });
  if (response.status === 200) {
    result["YouTube"] = '<b>YouTube: </b>Available 🎉';
  } else {
    result["YouTube"] = '<b>YouTube: </b>Not available 🚫';
  }
}

async function testDazn() {
  let response = await fetch(BASE_URL_Dazn, {
    method: 'GET',
    headers: {
      'User-Agent': UA
    }
  });
  if (response.status === 200) {
    result["Dazn"] = '<b>Dazn: </b>Available 🎉';
  } else {
    result["Dazn"] = '<b>Dazn: </b>Not available 🚫';
  }
}

async function testParam() {
  let response = await fetch(BASE_URL_Param, {
    method: 'GET',
    headers: {
      'User-Agent': UA
    }
  });
  if (response.status === 200) {
    result["Paramount"] = '<b>Paramount+: </b>Available 🎉';
  } else {
    result["Paramount"] = '<b>Paramount+: </b>Not available 🚫';
  }
}

async function testDisneyPlus() {
  try {
    let response = await fetch(BASE_URL_DISNEY, {
      method: 'GET',
      headers: {
        'User-Agent': UA
      }
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
    return { region: "US", status: status }; // Example region and status for Disney Plus
  } catch (error) {
    console.error("Error testing Disney Plus:", error);
    return { region: "US", status: STATUS_ERROR };
  }
}

async function testNf(id) {
  try {
    let response = await fetch(BASE_URL + id, {
      method: 'GET',
      headers: {
        'User-Agent': UA
      }
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
      headers: {
        'User-Agent': UA
      }
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
      headers: {
        'User-Agent': UA
      }
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
