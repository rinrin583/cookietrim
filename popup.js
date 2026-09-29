"use strict";

const $ = (selector) => document.querySelector(selector);
let currentHost = "";
let allowlist = [];

function hostIsAllowed(host, entry) {
  const value = String(entry || "").trim().toLowerCase();
  if (value.startsWith("*.")) {
    const suffix = value.slice(2);
    return host === suffix || host.endsWith(`.${suffix}`);
  }
  return host === value;
}

function renderSiteButton() {
  const paused = allowlist.some((entry) => hostIsAllowed(currentHost, entry));
  $("#toggle-site").textContent = paused ? "在此网站启用" : "在此网站暂停";
  $("#toggle-site").classList.toggle("danger", !paused);
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    currentHost = new URL(tab.url).hostname.toLowerCase();
  } catch {
    currentHost = "不可用";
  }

  const data = await chrome.storage.local.get({
    enabled: true,
    allowlist: [],
    statistics: { rejected: 0, saved: 0 },
    recentActions: []
  });

  allowlist = data.allowlist;
  $("#enabled").checked = data.enabled;
  $("#hostname").textContent = currentHost;
  $("#rejected-count").textContent = data.statistics.rejected || 0;
  $("#saved-count").textContent = data.statistics.saved || 0;

  const last = data.recentActions[0];
  if (last) {
    const actionLabels = {
      rejected: "已拒绝非必要 Cookie",
      adjusted: "已关闭非必要类别",
      saved: "已保存必要项设置",
      "opened-settings": "已打开偏好设置"
    };
    $("#last-action").textContent = `${actionLabels[last.action] || last.action} · ${last.hostname}`;
  }
  renderSiteButton();
}

$("#enabled").addEventListener("change", (event) => {
  chrome.storage.local.set({ enabled: event.target.checked });
});

$("#toggle-site").addEventListener("click", async () => {
  if (!currentHost || currentHost === "不可用") return;
  const index = allowlist.findIndex((entry) => hostIsAllowed(currentHost, entry));
  if (index >= 0) allowlist.splice(index, 1);
  else allowlist.push(currentHost);
  allowlist = [...new Set(allowlist)].sort();
  await chrome.storage.local.set({ allowlist });
  renderSiteButton();
});

$("#open-options").addEventListener("click", () => chrome.runtime.openOptionsPage());

init();
