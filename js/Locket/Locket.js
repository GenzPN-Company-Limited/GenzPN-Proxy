// ========= ID Mapping ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

// ========= Fixed Variables ========= // 
// =========  @Ohoang7 ========= // 

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

var subscriptionDetails = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2025-02-17T01:04:17Z",
  purchase_date: "2025-02-17T01:04:17Z",
  store: "app_store"
};

var entitlementDetails = {
  grace_period_expires_date: null,
  purchase_date: "2025-08-14T01:04:17Z",
  product_identifier: "com.ohoang7.premium.yearly",
  expires_date: "2099-12-18T01:04:17Z"
};

const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let [entitlementKey, subscriptionKey] = mapping[match];
  
  if (subscriptionKey) {
    entitlementDetails.product_identifier = subscriptionKey;
    obj.subscriber.subscriptions[subscriptionKey] = subscriptionDetails;
  } else {
    obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = subscriptionDetails;
  }

  obj.subscriber.entitlements[entitlementKey] = entitlementDetails;
} else {
  obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = subscriptionDetails;
  obj.subscriber.entitlements.pro = entitlementDetails;
}

$done({
  body: JSON.stringify(obj)
});
