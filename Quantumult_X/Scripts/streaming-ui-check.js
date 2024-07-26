/***

Thanks to & modified from 
1. https://gist.githubusercontent.com/Hyseen/b06e911a41036ebc36acf04ddebe7b9a/raw/nf_check.js
2. https://github.com/AtlantisGawrGura/Quantumult-X-Scripts/blob/main/media.js
3. https://github.com/CoiaPrant/MediaUnlock_Test/blob/main/check.sh
4. https://github.com/Netflixxp/chatGPT/blob/main/chat.sh

For Quantumult-X 598+ ONLY!!

2023-02-14

- 支持 ChatGPT 检测

[task_local]

event-interaction https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js, tag=流媒体-解锁查询, img-url=checkmark.seal.system, enabled=true

@XIAO_KOP

**/

const BASE_URL = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'

const FILM_ID = 81280792

const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" } 
const policy_name = "Netflix" //填入你的 netflix 策略组名

const arrow = " ➟ "

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'

// 即将登陆
const STATUS_COMING = 2
// 支持解锁
const STATUS_AVAILABLE = 1
// 不支持解锁
const STATUS_NOT_AVAILABLE = 0
// 检测超时
const STATUS_TIMEOUT = -1
// 检测异常
const STATUS_ERROR = -2

var opts = {
  policy: $environment.params
};

var opts1 = {
  policy: $environment.params,
  redirection: false
};

var flags = new Map([[ "AC" , "🇦🇨" ] ,["AE","🇦🇪"], [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , ["BA", "🇧🇦"], [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧ahrain"] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫" ] , [ "FO" , "🇫" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] ,["HU","🇭🇺"], [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "LU" , "🇱🇺" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇹🇼" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ] , [ "ZA" , "🇿🇦"] ])

var CHECK_PARAM = {
  netflix: "netflix",
  youtube_premium: "youtube_premium",
  chatGPT: "chatGPT",
};

var mediaList = [CHECK_PARAM.netflix, CHECK_PARAM.youtube_premium, CHECK_PARAM.chatGPT]

  ; (async () => {
    let panel_result = {
      title: "Streaming - Unlock Status",
      content: "",
      icon: "checkmark.seal",
      'icon-color': "#5AC8FA",      
    }
    await Promise.all(mediaList.map(async (media) => {
      let result;
      try {
        switch (media) {
          case CHECK_PARAM.netflix:
            result = await checkNetflix();
            break;
          case CHECK_PARAM.youtube_premium:
            result = await checkYT();
            break;
          case CHECK_PARAM.chatGPT:
            result = await checkGPT();
            break;
          default:
            break;
        }
        panel_result['content'] += result + "\n";
      } catch (error) {
        console.log(error)
      }
    }))
    $done(panel_result)
  })()

  async function checkNetflix() {
    try {
      let response = await httpAPI(BASE_URL + FILM_ID, 'GET', null, opts);
      console.log("Netflix: " + response.statusCode);
      if (response.statusCode === 200) {
        let url = response.headers['x-originating-url'];
        let region = url.split('/')[3];
        region = region === 'title' ? 'us' : region;
        let full_region = flags.get(region.toUpperCase()) ?? "Unknown region";
        return "Netflix:  " + full_region.toUpperCase() + arrow + "Unlocked ✔";
      } else if (response.statusCode === 403) {
        return "Netflix:  " + "Unable to use Netflix";
      } else {
        return "Netflix:  " + "Check failed";
      }
    } catch (error) {
      return "Netflix:  " + "Check error";
    }
  }
  
  async function checkYT() {
    try {
      let response = await httpAPI(BASE_URL_YTB, 'GET', null, opts);
      if (response.statusCode === 200) {
        let region = response.headers['x-originating-url'].split('/')[3];
        let full_region = flags.get(region.toUpperCase()) ?? "Unknown region";
        return "YouTube Premium:  " + full_region.toUpperCase() + arrow + "Unlocked ✔";
      } else if (response.statusCode === 403) {
        return "YouTube Premium:  " + "Unable to use YouTube Premium";
      } else {
        return "YouTube Premium:  " + "Check failed";
      }
    } catch (error) {
      return "YouTube Premium:  " + "Check error";
    }
  }
  
  async function checkGPT() {
    try {
      let response = await httpAPI(Region_URL_GPT, 'GET', null, opts);
      let region = response.body.split("loc=")[1].split("\n")[0];
      let full_region = flags.get(region.toUpperCase()) ?? "Unknown region";
      return "ChatGPT:  " + full_region.toUpperCase() + arrow + "Unlocked ✔";
    } catch (error) {
      return "ChatGPT:  " + "Check failed";
    }
  }
  

function httpAPI(url, method, headers, options) {
  return new Promise((resolve, reject) => {
    let request = {
      url: url,
      method: method,
      headers: headers,
      ...options
    }
    $httpClient.get(request, (error, response, body) => {
      if (error) reject(error)
      resolve(response)
    })
  })
}
