// Quantumult X rewrite rule for Alight Motion Premium

var obj = JSON.parse($response.body);
var url = $request.url;

console.log("Original URL:", url);
console.log("Original response:", $response.body);

if (url.includes('getAccountStatusAndLicenses')) {
  obj = {
    "data": {
      "licenses": [{
        "productId": "com.alightcreative.motion.sub.yearly",
        "active": true,
        "expiryDate": "2099-12-31T23:59:59Z",
        "status": "active"
      }],
      "accountStatus": {
        "active": true,
        "type": "premium",
        "tier": "pro"
      }
    },
    "success": true
  };
} else if (url.includes('purchases/verify/apple')) {
  obj = {
    "status": "active",
    "isLifetime": true
  };
} else if (url.includes('/v4/events')) {
  obj = {
    "data": {
      "status": "premium",
      "benefits": ["premium"]
    },
    "success": true
  };
} else if (url.includes('spidersense.bendingspoons.com')) {
  obj.premium_enabled = true;
  obj.subscription_active = true;
} else if (url.includes('googleapis.com/identitytoolkit')) {
  if (obj.users) {
    obj.users[0].premium = true;
    obj.users[0].subscriptionActive = true;
  }
}

console.log("Modified response:", JSON.stringify(obj));
$done({body: JSON.stringify(obj)});
