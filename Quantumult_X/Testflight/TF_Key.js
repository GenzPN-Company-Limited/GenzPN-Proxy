/*
Script Author: Yui Chy
*/

const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.*)\/apps$/;
const reg2 = /^https:\/\/testflight\.apple\.com\/join\/(.*)/;

if (reg1.test($request.url)) {
  $prefs.setValueForKey(null, "request_id");
  const key = $request.url.replace(/(.*accounts\/)(.*)(\/apps)/, "$2");
  const headers = Object.fromEntries(Object.entries($request.headers).map(([k, v]) => [k.toLowerCase(), v]));

  const session_id = headers["x-session-id"];
  const session_digest = headers["x-session-digest"];
  const request_id = headers["x-request-id"];

  $prefs.setValueForKey(key, "key");
  $prefs.setValueForKey(session_id, "session_id");
  $prefs.setValueForKey(session_digest, "session_digest");
  $prefs.setValueForKey(request_id, "request_id");

  if (request_id) {
    $notify("Tự động tham gia TestFlight", "Lấy thông tin thành công", "");
  } else {
    $notify("Tự động tham gia TestFlight", "Không thể lấy thông tin", "Vui lòng thêm testflight.apple.com vào danh sách cho phép");
  }

  $done({});
} else if (reg2.test($request.url)) {
  let appId = $prefs.valueForKey("APP_ID") || "";
  let arr = unique(appId.split(",").filter(Boolean));

  const id = reg2.exec($request.url)[1];
  if (!arr.includes(id)) arr.push(id);

  appId = arr.join(",");
  $prefs.setValueForKey(appId, "APP_ID");
  $notify("Tự động tham gia TestFlight", `Đã thêm APP_ID: ${id}`, `ID hiện tại: ${appId}`);
  $done({});
}

function unique(arr) {
  return [...new Set(arr)];
}
