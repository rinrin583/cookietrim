"use strict";

const http = require("node:http");

const port = 8765;

function page(title, body, script) {
  return `<!doctype html>
  <html lang="zh-CN"><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body{font-family:system-ui;margin:40px;background:#f5f7f6;color:#17221d}
    #result{padding:18px;border-radius:12px;background:#fff;border:2px solid #8a9890;font-size:20px;font-weight:700}
    [role=dialog]{position:fixed;inset:auto 30px 30px;padding:24px;background:#fff;border:2px solid #176b45;border-radius:14px;box-shadow:0 8px 40px #0004}
    button{margin:8px;padding:10px 16px}.hidden{display:none}.pass{border-color:#176b45!important;color:#176b45}.fail{border-color:#a32929!important;color:#a32929}
  </style></head><body><h1>${title}</h1><div id="result">WAITING</div>${body}<script>${script}</script></body></html>`;
}

const direct = page(
  "Test 1 - Direct reject",
  `<div id="cookie-banner" role="dialog" aria-modal="true"><h2>Cookie consent</h2><p>Choose how cookies are used.</p><button id="accept">Accept all</button><button id="reject">Reject all</button></div>`,
  `const result=document.querySelector('#result');
   document.querySelector('#accept').onclick=()=>{result.textContent='FAIL: Accept all was clicked';result.className='fail'};
   document.querySelector('#reject').onclick=()=>{result.textContent='PASS: Reject all was clicked';result.className='pass';document.querySelector('#cookie-banner').remove()};
   setTimeout(()=>{if(result.textContent==='WAITING'){result.textContent='FAIL: no action';result.className='fail'}},3000);`
);

const settings = page(
  "Test 2 - Necessary only settings",
  `<div id="cookie-consent" role="dialog" aria-modal="true"><div id="summary"><h2>Cookie consent</h2><button id="accept">Accept all</button><button id="manage">Manage choices</button></div><div id="preferences" class="hidden"><h2>Cookie settings</h2><label><input id="necessary" type="checkbox" checked disabled> Strictly necessary</label><label><input id="analytics" type="checkbox" checked> Analytics</label><label><input id="marketing" type="checkbox" checked> Marketing</label><button id="off">Turn off all</button><button id="save">Save choices</button></div></div>`,
  `const result=document.querySelector('#result');let accepted=false;
   document.querySelector('#accept').onclick=()=>{accepted=true;result.textContent='FAIL: Accept all was clicked';result.className='fail'};
   document.querySelector('#manage').onclick=()=>{document.querySelector('#summary').className='hidden';document.querySelector('#preferences').className=''};
   document.querySelector('#off').onclick=()=>{document.querySelector('#analytics').checked=false;document.querySelector('#marketing').checked=false};
   document.querySelector('#save').onclick=()=>{const ok=!accepted&&document.querySelector('#necessary').checked&&!document.querySelector('#analytics').checked&&!document.querySelector('#marketing').checked;result.textContent=ok?'PASS: only necessary remains':'FAIL: optional cookies remain';result.className=ok?'pass':'fail';document.querySelector('#cookie-consent').remove()};
   setTimeout(()=>{if(result.textContent==='WAITING'){result.textContent='FAIL: workflow incomplete';result.className='fail'}},4500);`
);

const acceptOnly = page(
  "Test 3 - Never auto accept",
  `<div id="privacy-cookie-banner" role="dialog" aria-modal="true"><h2>Cookie privacy choices</h2><p>This deliberately has no reject option.</p><button id="accept">Accept all</button></div>`,
  `const result=document.querySelector('#result');let clicked=false;
   document.querySelector('#accept').onclick=()=>{clicked=true;result.textContent='FAIL: Accept all was clicked';result.className='fail'};
   setTimeout(()=>{if(!clicked){result.textContent='PASS: Accept all remained untouched';result.className='pass'}},2500);`
);

const pages = { "/direct": direct, "/settings": settings, "/accept-only": acceptOnly };

const server = http.createServer((request, response) => {
  const html = pages[new URL(request.url, `http://127.0.0.1:${port}`).pathname];
  response.writeHead(html ? 200 : 404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  response.end(html || "Not found");
});

server.listen(port, "127.0.0.1", () => console.log(`COOKIE_TEST_SERVER=http://127.0.0.1:${port}`));
