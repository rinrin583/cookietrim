"use strict";

const DEFAULTS = {
  enabled: true,
  allowlist: [],
  showIndicator: true,
  debug: false,
  statistics: { rejected: 0, adjusted: 0, saved: 0, skipped: 0 },
  recentActions: []
};

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const missing = {};
  for (const [key, value] of Object.entries(DEFAULTS)) {
    if (current[key] === undefined) missing[key] = value;
  }
  if (Object.keys(missing).length) await chrome.storage.local.set(missing);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "nco-action") return false;

  (async () => {
    const stored = await chrome.storage.local.get(["statistics", "recentActions"]);
    const statistics = { ...DEFAULTS.statistics, ...(stored.statistics || {}) };
    if (Object.hasOwn(statistics, message.action)) statistics[message.action] += 1;

    const recentActions = [
      {
        action: message.action,
        method: message.method,
        hostname: message.hostname,
        buttonText: message.buttonText,
        at: message.at
      },
      ...(stored.recentActions || [])
    ].slice(0, 20);

    await chrome.storage.local.set({ statistics, recentActions });

    if (sender.tab?.id && ["rejected", "saved"].includes(message.action)) {
      await chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: "#176b45" });
      await chrome.action.setBadgeText({ tabId: sender.tab.id, text: "✓" });
      setTimeout(() => chrome.action.setBadgeText({ tabId: sender.tab.id, text: "" }).catch(() => {}), 3500);
    }
    sendResponse({ ok: true });
  })().catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
