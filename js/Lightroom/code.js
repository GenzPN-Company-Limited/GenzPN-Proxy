try {
    // Clean the response body
    let body = $response.body.replace(/while.{7}\n/, "");
    
    // Parse JSON
    let obj = JSON.parse(body);
    
    // Modify user profile details (from second script)
    obj.email = obj.email || "nguyenvoanhson75@gmail.com"; // Preserve original email if available
    obj.full_name = obj.full_name || "GenzPN Company Limited";
    obj.first_name = obj.first_name || "GenzPN";
    obj.last_name = obj.last_name || "Company Limited";
    
    // Ensure entitlement exists
    obj.entitlement = obj.entitlement || {};
    obj.entitlement.status = "subscriber";
    
    // Update subscription details (based on first script for Lightroom features)
    obj.current_subs = {
        "product_id": "lightroom",
        "store": "adobe",
        "purchase_date": "2025-10-06T09:34:00.000Z", // Updated to 2025, current UTC time
        "sao": {
            "inpkg_CCES": "0",
            "inpkg_CCLE": "1", // Likely enables Lightroom premium features
            "inpkg_CCSN": "0",
            "inpkg_CCSV": "0",
            "inpkg_LCCC": "0",
            "inpkg_LPES": "0",
            "inpkg_LRBRL": "0",
            "inpkg_LRMAC": "0",
            "inpkg_LRMC": "1", // Added from second script for broader compatibility
            "inpkg_LRMP": "0",
            "inpkg_LRTB": "0",
            "inpkg_PHLT": "0",
            "inpkg_PHLT2": "0",
            "inpkg_PLES": "0",
            "storage_quota": "100" // Set to 100GB for cloud storage
            // Omitted extra fields from second script (e.g., LRM0GB, LRPUF, LRWIN) to avoid conflicts
        }
    };
    
    // Add storage entitlement for cloud features
    obj.entitlement.storage = {
        "used": 0,
        "limit": 1154487209165, // ~1TB in bytes
        "display_limit": 1099511627776, // 1TB display-friendly
        "warn": 992137445376 // Warning at ~900GB
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