const BASE_URL = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const FILM_ID = 81280792;
const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace';

const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" }; 
const policy_name = "Netflix"; // Fill in your Netflix policy group name

const arrow = " ➟ ";

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36';

const STATUS_COMING = 2;
const STATUS_AVAILABLE = 1;
const STATUS_NOT_AVAILABLE = 0;
const STATUS_TIMEOUT = -1;
const STATUS_ERROR = -2;

var opts = { policy: $environment.params };
var opts1 = { policy: $environment.params, redirection: false };

var flags = new Map([
  // ... (your flag map here)
]);

let result = {
  "title": '    📺  流媒体服务查询',
  "YouTube": '<b>YouTube: </b>检测失败，请重试 ❗️',
  "Netflix": '<b>Netflix: </b>检测失败，请重试 ❗️',
  "ChatGPT" : "<b>ChatGPT: </b>检测失败，请重试 ❗️"
};

const message = { action: "get_policy_state", content: $environment.params };

(async () => {
  try {
    await testYTB();
    let [{ region, status }] = await Promise.all([testNf(FILM_ID), testDiscovery(), testChatGPT()]);
    
    console.log("NetFlix Result:" + result["Netflix"]);

    let content = "------------------------------" + "</br>" + ([result["YouTube"], result["Netflix"], result["Disney"], result["Dazn"], result["Paramount"], result["Discovery"], result["ChatGPT"]]).join("</br></br>");
    content = content + "</br>------------------------------</br>" + "<font color=#CD5C5C ><b>节点</b> ➟ " + $environment.params + "</font>";
    content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`;

    $configuration.sendMessage(message).then(resolve => {
      if (resolve.error) {
        console.log(resolve.error);
        $done();
      }
      if (resolve.ret) {
        let output = JSON.stringify(resolve.ret[message.content]) ? JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g, "").replace(/\,/g, " ➟ ") : $environment.params;
        let content = "--------------------------------------</br>" + ([result["Dazn"], result["Discovery"], result["Paramount"], result["Disney"], result["ChatGPT"], result["Netflix"], result["YouTube"]]).join("</br></br>");
        content = content + "</br>--------------------------------------</br>" + "<font color=#CD5C5C>" + "<b>节点</b> ➟ " + output + "</font>";
        content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`;
        console.log(output);
        $done({ "title": result["title"], "htmlMessage": content });
      }
    }, reject => {
      console.log(reject);
      $done();
    });
  } catch (error) {
    console.error(error);
    $done({ "title": result["title"], "htmlMessage": `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">----------------------</br></br>🚥 检测异常</br></br>----------------------</br>${error}</p>` });
  }
})();

function timeout(delay = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout');
    }, delay);
  });
}

function testNf(filmId) {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL + filmId,
      opts: opts,
      timeout: 5200,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      console.log("nf:" + response.statusCode);
      if (response.statusCode === 404) {
        result["Netflix"] = "<b>Netflix: </b>支持自制剧集 ⚠️";
        console.log("nf:" + result["Netflix"]);
        resolve('Not Found');
      } else if (response.statusCode === 403) {
        result["Netflix"] = "<b>Netflix: </b>未支持 🚫";
        console.log("nf:" + result["Netflix"]);
        resolve('Not Available');
      } else if (response.statusCode === 200) {
        let url = response.headers['X-Originating-URL'];
        let region = url.split('/')[3].split('-')[0];
        if (region == 'title') {
          region = 'us';
        }
        console.log("nf:" + region);
        result["Netflix"] = "<b>Netflix: </b>完整支持" + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉";
        resolve("nf:" + result["Netflix"]);
      } else {
        resolve("Netflix Test Error");
      }
    }, reason => {
      result["Netflix"] = "<b>Netflix: </b>检测超时 🚦";
      console.log(result["Netflix"]);
      resolve("timeout");
    });
  });
}

function testYTB() { 
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL_YTB,
      opts: opts,
      timeout: 2800,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      let data = response.body;
      console.log("ytb:" + response.statusCode);
      if (response.statusCode !== 200) {
        result["YouTube"] = "<b>YouTube Premium: </b>检测失败 ❗️";
      } else if (data.indexOf('Premium is not available in your country') !== -1) {
        result["YouTube"] = "<b>YouTube Premium: </b>未支持 🚫";
      } else {
        let region = '';
        let re = new RegExp('"GL":"(.*?)"', 'gm');
        let ret = re.exec(data);
        if (ret != null && ret.length === 2) {
          region = ret[1];
        } else if (data.indexOf('www.google.cn') !== -1) {
          region = 'CN';
        } else {
          region = 'US';
        }
        result["YouTube"] = "<b>YouTube Premium: </b>支持 " + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉";
        console.log("ytb:" + region + result["YouTube"]);
      }
    }, reason => {
      result["YouTube"] = "<b>YouTube Premium: </b>检测超时 🚦";
    });
  });
}

// openai test

const support_countryCodes = ["T1", "XX", /* ... other country codes ... */];

function testChatGPT() {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL_GPT,
      opts: opts1,
      timeout: 2800
    };
    $task.fetch(option).then(response => {
      let resp = JSON.stringify(response);
      console.log("ChatGPT Main Test");
      let jdg = resp.indexOf("check=somevalue");
      if (response.statusCode === 403) {
        result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫";
      } else if (response.statusCode === 200 && jdg !== -1) {
        result["ChatGPT"] = "<b>ChatGPT: </b>支持 🎉";
      } else {
        result["ChatGPT"] = "<b>ChatGPT: </b>检测失败 ❗️";
      }
    }, reason => {
      result["ChatGPT"] = "<b>ChatGPT: </b>检测超时 🚦";
    });
  });
}

function testDiscovery() {
  return new Promise((resolve, reject) => {
    let option = {
      url: Region_URL_GPT,
      opts: opts1,
      timeout: 2800
    };
    $task.fetch(option).then(response => {
      let data = JSON.stringify(response);
      console.log("Discovery");
      let jdg = data.indexOf("try=somevalue");
      if (response.statusCode === 403) {
        result["Discovery"] = "<b>Discovery+: </b>未支持 🚫";
      } else if (response.statusCode === 200 && jdg !== -1) {
        result["Discovery"] = "<b>Discovery+: </b>支持 🎉";
      } else {
        result["Discovery"] = "<b>Discovery+: </b>检测失败 ❗️";
      }
    }, reason => {
      result["Discovery"] = "<b>Discovery+: </b>检测超时 🚦";
    });
  });
}
