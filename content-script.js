(() => {
  "use strict";

  if (globalThis.__necessaryCookiesOnlyLoaded) return;
  globalThis.__necessaryCookiesOnlyLoaded = true;

  const R = globalThis.NCO_RULES;
  if (!R || !globalThis.chrome?.storage) return;

  const DEFAULTS = {
    enabled: true,
    allowlist: [],
    showIndicator: true,
    debug: false
  };

  const state = {
    settings: DEFAULTS,
    actionCount: 0,
    settingsOpened: false,
    adjusted: false,
    completed: false,
    scanTimer: null,
    startedAt: Date.now(),
    clicked: new WeakSet()
  };

  function log(...args) {
    if (state.settings.debug) console.debug("[CookieTrim]", ...args);
  }

  function hostnameMatches(pattern) {
    const host = location.hostname.toLowerCase();
    const value = String(pattern || "").trim().toLowerCase();
    if (!value) return false;
    if (value.startsWith("*.")) {
      const suffix = value.slice(2);
      return host === suffix || host.endsWith(`.${suffix}`);
    }
    return host === value;
  }

  function isAllowedSite() {
    return state.settings.allowlist.some(hostnameMatches);
  }

  function elementText(element) {
    return R.normalizeText(
      element?.innerText ||
      element?.textContent ||
      element?.value ||
      element?.getAttribute?.("aria-label") ||
      element?.getAttribute?.("title") ||
      ""
    );
  }

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 1 && rect.height > 1;
  }

  function isClickable(element) {
    return isVisible(element) && !element.disabled && element.getAttribute("aria-disabled") !== "true";
  }

  function collectRoots(start = document) {
    const roots = [start];
    const walker = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.shadowRoot) roots.push(...collectRoots(node.shadowRoot));
    }
    return roots;
  }

  function queryAll(selector) {
    const results = [];
    for (const root of collectRoots()) {
      try {
        results.push(...root.querySelectorAll(selector));
      } catch (error) {
        log("Selector failed", selector, error);
      }
    }
    return results;
  }

  function consentContainerFor(element) {
    const container = element.closest?.(R.consentContainerSelector);
    if (!container || !isVisible(container)) return null;
    const context = elementText(container).slice(0, 5000);
    return R.matchesAny(context, R.consentContextPatterns) ? container : null;
  }

  function safeGenericCandidate(element) {
    const text = elementText(element);
    if (!text || R.matchesAny(text, R.acceptPatterns)) return false;
    return Boolean(consentContainerFor(element));
  }

  function showIndicator(symbol, label, color) {
    if (!state.settings.showIndicator || window !== window.top || !document.documentElement) return;
    const host = document.createElement("div");
    host.setAttribute("data-nco-indicator", "");
    const shadow = host.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        div { position: fixed; right: 14px; bottom: 14px; z-index: 2147483647;
          display: flex; align-items: center; gap: 7px; padding: 8px 11px;
          color: #fff; background: ${color}; border-radius: 999px;
          font: 600 12px/1.2 system-ui, sans-serif; box-shadow: 0 3px 14px #0005; }
        span:first-child { font-size: 15px; }
      </style>
      <div role="status"><span>${symbol}</span><span>${label}</span></div>`;
    document.documentElement.appendChild(host);
    setTimeout(() => host.remove(), 3200);
  }

  function report(action, method, text) {
    const payload = {
      type: "nco-action",
      action,
      method,
      buttonText: String(text || "").slice(0, 120),
      hostname: location.hostname,
      at: new Date().toISOString()
    };
    chrome.runtime.sendMessage(payload).catch(() => {});
    if (action === "rejected" || action === "saved") {
      showIndicator("✓", "仅保留必要 Cookie", "#176b45");
    }
    log("Action", payload);
  }

  function clickElement(element, action, method) {
    if (!isClickable(element) || state.clicked.has(element) || state.actionCount >= 8) return false;
    state.clicked.add(element);
    state.actionCount += 1;
    const text = elementText(element);
    element.click();
    report(action, method, text);
    scheduleScan(220);
    return true;
  }

  function clickFirstKnown(selectors, action, method) {
    for (const selector of selectors) {
      const element = queryAll(selector).find(isClickable);
      if (element && clickElement(element, action, `${method}:${selector}`)) return true;
    }
    return false;
  }

  function clickByText(patterns, action, method, requireConsentContext = true) {
    for (const element of queryAll(R.clickableSelector)) {
      if (!isClickable(element)) continue;
      const text = elementText(element);
      if (!R.matchesAny(text, patterns)) continue;
      if (R.matchesAny(text, R.acceptPatterns)) continue;
      if (requireConsentContext && !safeGenericCandidate(element)) continue;
      if (clickElement(element, action, method)) return true;
    }
    return false;
  }

  function disableOptionalCheckbox() {
    for (const checkbox of queryAll("input[type='checkbox']:checked")) {
      if (!isClickable(checkbox) || checkbox.disabled) continue;
      const id = checkbox.id;
      const root = checkbox.getRootNode();
      let label = id && root.querySelector ? root.querySelector(`label[for='${CSS.escape(id)}']`) : null;
      label ||= checkbox.closest("label");
      const context = R.normalizeText(`${elementText(label)} ${elementText(checkbox.parentElement)}`);
      if (R.matchesAny(context, R.necessaryPatterns)) continue;
      if (!R.matchesAny(context, R.optionalCategoryPatterns)) continue;
      checkbox.click();
      state.adjusted = true;
      state.actionCount += 1;
      report("adjusted", "optional-checkbox", context);
      scheduleScan(180);
      return true;
    }
    return false;
  }

  function scan() {
    state.scanTimer = null;
    if (!state.settings.enabled || isAllowedSite() || state.completed) return;
    if (Date.now() - state.startedAt > 60000 || state.actionCount >= 8) return;

    if (clickFirstKnown(R.knownRejectSelectors, "rejected", "known-reject")) {
      state.completed = true;
      return;
    }

    if (clickByText(R.rejectPatterns, "rejected", "safe-text-reject")) {
      state.completed = true;
      return;
    }

    if (!state.settingsOpened) {
      const hasKnownTurnOff = R.knownTurnOffSelectors.some((selector) => queryAll(selector).some(isClickable));
      const hasConsentSave = queryAll(R.clickableSelector).some((element) =>
        isClickable(element) &&
        R.matchesAny(elementText(element), R.savePatterns) &&
        safeGenericCandidate(element)
      );
      if (hasKnownTurnOff || hasConsentSave) state.settingsOpened = true;
    }

    if (state.settingsOpened) {
      if (clickFirstKnown(R.knownTurnOffSelectors, "adjusted", "known-turn-off")) {
        state.adjusted = true;
        return;
      }
      if (clickByText(R.turnOffPatterns, "adjusted", "safe-text-turn-off")) {
        state.adjusted = true;
        return;
      }
      if (disableOptionalCheckbox()) return;
      if (state.adjusted && clickByText(R.savePatterns, "saved", "safe-text-save")) {
        state.completed = true;
        return;
      }
    }

    if (!state.settingsOpened) {
      if (clickFirstKnown(R.knownSettingsSelectors, "opened-settings", "known-settings")) {
        state.settingsOpened = true;
        return;
      }
      if (clickByText(R.settingsPatterns, "opened-settings", "safe-text-settings")) {
        state.settingsOpened = true;
      }
    }
  }

  function scheduleScan(delay = 300) {
    if (state.scanTimer || state.completed) return;
    state.scanTimer = setTimeout(scan, delay);
  }

  async function start() {
    try {
      state.settings = { ...DEFAULTS, ...(await chrome.storage.local.get(DEFAULTS)) };
    } catch {
      state.settings = DEFAULTS;
    }
    if (!state.settings.enabled || isAllowedSite()) return;

    scheduleScan(50);
    const observer = new MutationObserver(() => scheduleScan(260));
    observer.observe(document.documentElement || document, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 60000);

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      for (const [key, change] of Object.entries(changes)) {
        state.settings[key] = change.newValue;
      }
      scheduleScan(0);
    });
  }

  start();
})();
