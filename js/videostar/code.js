let obj = JSON.parse($response.body);

obj.latest_receipt = [{
  "quantity": "1",
  "product_id": "OneYearUnlockVS",
  "transaction_id": "230000563000000",
  "original_transaction_id": "230000563000000",
  "purchase_date": "2024-01-24 00:08:51 Etc/GMT",
  "purchase_date_ms": "1705968531000",
  "purchase_date_pst": "2024-01-23 17:08:51 America/Los_Angeles",
  "original_purchase_date": "2024-01-24 00:08:57 Etc/GMT", 
  "original_purchase_date_ms": "1705968537000",
  "original_purchase_date_pst": "2024-01-23 17:08:57 America/Los_Angeles",
  "expires_date": "2026-01-26 00:08:51 Etc/GMT",
  "expires_date_ms": "1769040531000",
  "expires_date_pst": "2026-01-25 17:08:51 America/Los_Angeles",
  "web_order_line_item_id": "230000189000000",
  "is_trial_period": "false",
  "is_in_intro_offer_period": "false",
  "subscription_group_identifier": "20300000"
}];

obj.in_app = [{
  "quantity": "1", 
  "product_id": "OneYearUnlockVS",
  "transaction_id": "230000563000000",
  "original_transaction_id": "230000563000000",
  "purchase_date": "2024-01-24 00:08:51 Etc/GMT",
  "purchase_date_ms": "1705968531000",
  "purchase_date_pst": "2024-01-23 17:08:51 America/Los_Angeles",
  "original_purchase_date": "2024-01-24 00:08:57 Etc/GMT",
  "original_purchase_date_ms": "1705968537000",
  "original_purchase_date_pst": "2024-01-23 17:08:57 America/Los_Angeles",
  "expires_date": "2026-01-26 00:08:51 Etc/GMT",
  "expires_date_ms": "1769040531000",
  "expires_date_pst": "2026-01-25 17:08:51 America/Los_Angeles",
  "web_order_line_item_id": "230000189000000",
  "is_trial_period": "false",
  "is_in_intro_offer_period": "false"
}];

obj.activeSubs = {
  "OneYearUnlockVS": "4102445330000"
};

$done({body: JSON.stringify(obj)});