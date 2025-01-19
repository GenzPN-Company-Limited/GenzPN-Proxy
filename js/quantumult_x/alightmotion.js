// Quantumult X rewrite rule for Alight Motion Premium

var obj = JSON.parse($response.body);
var url = $request.url;

if (url.includes('getAccountStatusAndLicenses')) {
  obj = {
    "data": {
      "licenses": [{
        "productId": "com.alightcreative.motion.sub.yearly",
        "subscriptionId": "premium_subscription",
        "active": true,
        "expiryDate": "2099-12-31T23:59:59Z",
        "type": "subscription",
        "platform": "ios", 
        "status": "active"
      }],
      "accountStatus": {
        "active": true,
        "type": "premium",
        "expiry": "2099-12-31T23:59:59Z",
        "isFreeTrial": false,
        "tier": "pro"
      },
      "appBuild": 767,
      "appVersion": "6.2.10",
      "deviceModel": "iPhone15,3",
      "platform": "ios",
      "language": "vi",
      "country": "VN"
    },
    "success": true,
    "statusCode": 200
  };
} else if (url.includes('purchases/verify/apple')) {
  obj = {
    "status": "active",
    "isLifetime": true,
    "expiryDate": "2099-12-31T23:59:59Z"
  };
} else if (url.includes('api.pico.bendingspoonsapps.com/v4/events')) {
  obj = {
    "data": {
      "appday": {"value": "1"},
      "exportCount": {"value": "999"},
      "benefits": ["premium"],
      "projectCount": {"value": "999"},
      "elementCount": {"value": "999"},
      "status": "premium"
    },
    "success": true
  };
}

console.log("Modified response:", JSON.stringify(obj));
$done({body: JSON.stringify(obj)});
