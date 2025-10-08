try {
    // Clean response body (remove anti-tampering like while(1);)
    let body = $response.body.replace(/while.{7}\n/, "");
    
    // Parse JSON
    let obj = JSON.parse(body);
    
    // Modify user profile (optional, from docs: email/full_name are in account response)
    obj.email = obj.email || "premium@example.com"; // Use real email if possible to avoid mismatch
    obj.full_name = obj.full_name || "Premium User";
    if (!obj.first_name) obj.first_name = "Premium";
    if (!obj.last_name) obj.last_name = "User";
    
    // Ensure entitlement exists (core from /v2/accounts response)
    obj.entitlement = obj.entitlement || {};
    obj.entitlement.status = "subscriber"; // Unlocks general premium status
    
    // Update current_subs (align with sao flags from docs for Lightroom features)
    obj.current_subs = {
        "product_id": "lightroom",
        "store": "adobe",
        "purchase_date": new Date().toISOString(), // Dynamic: Current date (2025-10-08Txx:xx:xxZ)
        "sao": {
            "inpkg_CCES": "0",
            "inpkg_CCLE": "1", // Enables Creative Cloud Lightroom Edition (key for premium edits)
            "inpkg_CCSN": "0",
            "inpkg_CCSV": "0",
            "inpkg_LCCC": "0",
            "inpkg_LPES": "0",
            "inpkg_LRBRL": "0",
            "inpkg_LRM0GB": "0",
            "inpkg_LRM40GB": "0",
            "inpkg_LRMAC": "0",
            "inpkg_LRMC": "1", // Enables Lightroom Mobile Classic (for app features)
            "inpkg_LRMP": "1", // Added: Lightroom Mobile Premium (from docs inference for cloud/mobile)
            "inpkg_LRPUF": "0",
            "inpkg_LRTB": "0",
            "inpkg_LRWIN": "0",
            "inpkg_PHLT": "0",
            "inpkg_PHLT2": "0",
            "inpkg_PLES": "0",
            "storage_quota": "100" // 100GB quota for cloud storage
        }
    };
    
    // Add storage entitlement (critical for Lightroom cloud sync, from docs)
    obj.entitlement.storage = {
        "used": 0,
        "limit": 1099511627776, // 1TB in bytes (standard premium limit)
        "display_limit": 1099511627776,
        "warn": 989560944000 // ~900GB warning threshold
    };
    
    // Safely handle avatar (from account response in docs)
    if (!obj.avatar) {
        obj.avatar = {};
    }
    obj.avatar.placeholder = true;
    
    // Serialize and return
    body = JSON.stringify(obj, null, 2); // Pretty-print for easier debugging
    $done({ body });
} catch (error) {
    console.log("[Lightroom Script Error] " + error.message + " | Original body length: " + $response.body.length);
    $done({ body: $response.body }); // Fallback to original
}