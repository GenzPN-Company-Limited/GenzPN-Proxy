fbiossdk = {
    "status": "success",
    "response": [
      {
        "status": "SUBSCRIPTION_PURCHASED",
        "order_id": "99470000484218949",
        "original_order_id": "470000484218949",
        "is_trial": false,
        "plan_meta": {
          "product_id": "subscription_test_yearly",
          "frequency": "yearly",
          "scope_id": "full",
          "id": "com.picsart.studio.subscription_test_yearly",
          "storage_limit_in_mb": 5120,
          "level": 1500,
          "type": "renewable",
          "tier_id": "gold_old",
          "permissions": [
            "premium_tools_standard",
            "premium_tools_ai"
          ]
        },
        "reason": "ok",
        "subscription_id": "com.picsart.studio.subscription_test_yearly",
        "is_eligible_for_introductory": false,
        "purchase_date": 1564114480000,
        "expire_date": 253394614800000
      }
    ]
  }
  
  $done({body: JSON.stringify(fbiossdk)});