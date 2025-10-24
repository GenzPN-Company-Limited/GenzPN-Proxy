// ==UserScript==
// @name         RoX Ultimate
// @namespace    https://www.rophim.li/
// @version      2.1.1
// @description  Ultimate patch for RoPhim: works in VPN App and in-browser userscript (QX Debug)
// @author       anhwaivo, hth4nh, dabeecao, hscavn, hiepkimcdtk55
// @match        https://www.rophim.li/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* ---------------------------
   SHADOWROCKET / SURGE / QUANTUMULT X PATCH (Response body modification)
   --------------------------- */
if (typeof $response !== 'undefined' && typeof $done === 'function') {
  // Bắt đầu debug cho môi trường QX/Surge/Shadowrocket
  console.log('[RoX QX Debug] Script initiated for Response.'); 

  let b = $response.body;
  
  if (b) {
    let originalBody = b;
    try {
      // Thử phân tích JSON để đảm bảo đây là phản hồi JSON hợp lệ
      JSON.parse(b); 
      
      // Log thông tin cơ bản về phản hồi gốc
      // console.log('[RoX QX Debug] Original JSON (snippet): ' + originalBody.substring(0, 50));
      
      // Thực hiện thay thế
      b = b
        .replace(/("is_vip"|"is_verified")\s*:\s*false/g, '$1:true')
        .replace(/("vip_expires_at")\s*:\s*0/g, '$1:253394586000')
        .replace(/("coin_balance")\s*:\s*\d+/g, '"coin_balance":999999999');

      if (b !== originalBody) {
        console.log('%c[RoX QX Debug] JSON Replacement SUCCESSFUL!', 'color: #2ecc71;');
        // console.log('[RoX QX Debug] Modified JSON (snippet): ' + b.substring(0, 50));
      } else {
        console.log('[RoX QX Debug] JSON processed, but no replacement was made (perhaps already VIP).');
      }
    } catch (e) {
      console.error('[RoX QX Error] Failed to parse JSON or during replacement:', e);
    }
  } else {
    console.warn('[RoX QX Debug] Response body is empty.');
  }
  $done({ body: b });
}

/* ---------------------------
   BROWSER USERSCRIPT PATCH
   (Phần này sẽ bị bỏ qua khi chạy trong QX)
   --------------------------- */
// (function () { ... phần còn lại của script cũ ... })();

// DO NOT USE THE REST OF THE CODE IF YOU ONLY USE QX. 
// KEEP ONLY THE QX PART FOR BETTER PERFORMANCE IN QX.

// ... Giữ lại phần còn lại nếu bạn muốn dùng chung script này cho cả Tampermonkey/Greasemonkey
// ... Nếu không, hãy xóa phần phía dưới để tối ưu cho QX.
(function () {
  if (typeof window === 'undefined') return;
  'use strict';

  // Phần code này dành cho trình duyệt (Tampermonkey/Greasemonkey) và sẽ không chạy trong QX
  // (vì nó được bọc trong 'if (typeof window === 'undefined') return;' và kiểm tra môi trường QX ở trên)

  // HÀM isTargetUrl và tryJsonReplace được tái định nghĩa (không có logs) để giữ sạch code gốc
  function isTargetUrl(url) {
    try { return typeof url === 'string' && url.indexOf('/v1/user/info') !== -1; } catch { return false; }
  }

  function tryJsonReplace(text) {
    if (typeof text !== 'string' || text.length === 0) return text;
    try {
      JSON.parse(text); 
      return text
        .replace(/("is_vip"|"is_verified")\s*:\s*false/g, '$1:true')
        .replace(/("vip_expires_at")\s*:\s*0/g, '$1:253394586000')
        .replace(/("coin_balance")\s*:\s*\d+/g, '"coin_balance":999999999');
    } catch {
      return text;
    }
  }

  /* ---------- Hook XMLHttpRequest ---------- */
  (function hookXHR() {
    if (!window.XMLHttpRequest) return;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      try { this._roxUrl = typeof url === 'string' ? url : ''; } catch { this._roxUrl = ''; }
      return originalOpen.call(this, method, url, async, user, pass);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener('load', function () {
        try {
          const url = this._roxUrl || '';
          if (!isTargetUrl(url)) return;
          const isTextResponse = !this.responseType || this.responseType === '' || this.responseType === 'text';
          if (!isTextResponse) return;

          const origText = typeof this.responseText === 'string' ? this.responseText : '';
          const newText = tryJsonReplace(origText);
          if (newText === origText) return;

          // override getters to serve modified text
          try { Object.defineProperty(this, 'responseText', { configurable: true, enumerable: true, get: function () { return newText; } }); } catch (e) { console.warn('[RoX] responseText override failed:', e); }
          try { Object.defineProperty(this, 'response', { configurable: true, enumerable: true, get: function () { return newText; } }); } catch (e) { console.warn('[RoX] response override failed:', e); }
        } catch (err) {
          console.error('[RoX XHR Hook Error]', err);
        }
      });
      return originalSend.apply(this, args);
    };
  })();

  /* ---------- Hook fetch ---------- */
  (function hookFetch() {
    if (!window.fetch) return;
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      const reqUrl = (function () { try { if (typeof input === 'string') return input; if (input && input.url) return input.url; } catch {} return ''; })();
      if (!isTargetUrl(reqUrl)) { return originalFetch.apply(this, arguments); }
      return originalFetch.apply(this, arguments).then(async (resp) => {
        try {
          const clone = resp.clone();
          const contentType = clone.headers.get('content-type') || '';
          if (!contentType.includes('application/json') && !contentType.includes('text/')) { return resp; }
          const origText = await clone.text();
          const newText = tryJsonReplace(origText);
          if (newText === origText) return resp;
          const newResp = new Response(newText, { status: resp.status, statusText: resp.statusText, headers: resp.headers });
          return newResp;
        } catch (e) {
          console.error('[RoX Fetch Hook Error]', e);
          return resp;
        }
      });
    };
  })();
})();