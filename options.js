"use strict";

const $ = (selector) => document.querySelector(selector);

async function load() {
  const data = await chrome.storage.local.get({
    enabled: true,
    allowlist: [],
    showIndicator: true,
    debug: false
  });
  $("#enabled").checked = data.enabled;
  $("#show-indicator").checked = data.showIndicator;
  $("#debug").checked = data.debug;
  $("#allowlist").value = data.allowlist.join("\n");
}

$("#save").addEventListener("click", async () => {
  const allowlist = $("#allowlist").value
    .split(/\r?\n/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .filter((value) => /^(\*\.)?[a-z0-9.-]+$/.test(value));

  await chrome.storage.local.set({
    enabled: $("#enabled").checked,
    showIndicator: $("#show-indicator").checked,
    debug: $("#debug").checked,
    allowlist: [...new Set(allowlist)].sort()
  });

  $("#status").textContent = "已保存";
  setTimeout(() => { $("#status").textContent = ""; }, 1800);
});

load();
