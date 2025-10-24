// ==UserScript==
// @name         RoX Ultimate (QX Optimized)
// @namespace    https://www.rophim.li/
// @version      2.1.1
// @description  Ultimate patch for RoPhim: optimized for Quantumult X
// @author       anhwaivo, hth4nh, dabeecao, hscavn, hiepkimcdtk55
// @match        https://www.rophim.li/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* ---------------------------
   QUANTUMULT X / SURGE / SHADOWROCKET PATCH (Response body modification)
   -> Code này là phần DUY NHẤT cần thiết cho QX.
   --------------------------- */
if (typeof $response !== 'undefined' && typeof $done === 'function') {
  // Bắt đầu debug cho môi trường QX/Surge/Shadowrocket
  console.log('[RoX QX Debug] Script initiated for Response.'); 

  let b = $response.body;
  
  if (b) {
    let originalBody = b;
    try {
      JSON.parse(b); 
      
      b = b
        .replace(/("is_vip"|"is_verified")\s*:\s*false/g, '$1:true')
        .replace(/("vip_expires_at")\s*:\s*0/g, '$1:253394586000')
        .replace(/("coin_balance")\s*:\s*\d+/g, '"coin_balance":999999999');

      if (b !== originalBody) {
        console.log('%c[RoX QX Debug] JSON Replacement SUCCESSFUL!', 'color: #2ecc71;');
      } else {
        console.log('[RoX QX Debug] JSON processed, but no replacement was made.');
      }
    } catch (e) {
      console.error('[RoX QX Error] Failed to parse JSON or during replacement:', e);
    }
  } else {
    console.warn('[RoX QX Debug] Response body is empty.');
  }
  $done({ body: b });
}

// Phần code cho trình duyệt đã được loại bỏ.