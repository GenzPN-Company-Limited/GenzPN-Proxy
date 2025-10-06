try {
    // Clean the response body
    let body = $response.body.replace(/while.{7}\n/, "");
    
    // Parse JSON
    let obj = JSON.parse(body);
    
    // Modify subscription status
    obj.entitlement = obj.entitlement || {};
    obj.entitlement.status = "subscriber";
    
    // Update subscription details
    obj.current_subs = {
        "product_id": "lightroom",
        "store": "adobe",
        "purchase_date": "2025-10-06T09:17:00.000Z", // Updated to 2025, based on current UTC time
        "sao": {
            "inpkg_CCES": "0",
            "inpkg_CCLE": "1",
            "inpkg_CCSN": "0",
            "inpkg_CCSV": "0",
            "inpkg_LCCC": "0",
            "inpkg_LPES": "0",
            "inpkg_LRBRL": "0",
            "inpkg_LRMAC": "0",
            "inpkg_LRMC": "0",
            "inpkg_LRMP": "0",
            "inpkg_LRTB": "0",
            "inpkg_PHLT": "0",
            "inpkg_PHLT2": "0",
            "inpkg_PLES": "0",
            "storage_quota": "100"
        }
    };
    
    // Update storage entitlement
    obj.entitlement.storage = {
        "used": 0,
        "limit": 1154487209165,
        "display_limit": 1099511627776,
        "warn": 992137445376
    };
    
    // Safely set avatar placeholder
    if (!obj.avatar) {
        obj.avatar = {};
    }
    obj.avatar.placeholder = true;
    
    // Serialize and return modified body
    body = JSON.stringify(obj);
    $done({ body });
} catch (error) {
    console.log("[Error] Script failed: " + error.message);
    $done({ body: $response.body }); // Return original response on error
}