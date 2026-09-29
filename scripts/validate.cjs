"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

if (manifest.manifest_version !== 3) throw new Error("manifest_version must be 3");
if (!manifest.content_scripts?.length) throw new Error("content_scripts missing");
if (!manifest.permissions?.includes("storage")) throw new Error("storage permission missing");

const referenced = new Set([
  manifest.background?.service_worker,
  manifest.action?.default_popup,
  manifest.options_page,
  ...Object.values(manifest.icons || {}),
  ...Object.values(manifest.action?.default_icon || {}),
  ...manifest.content_scripts.flatMap((entry) => entry.js || [])
].filter(Boolean));

for (const file of referenced) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Referenced file missing: ${file}`);
}

if (manifest.name !== "CookieTrim") throw new Error("Public brand name must be CookieTrim");
if (manifest.version !== require(path.join(root, "package.json")).version) {
  throw new Error("Manifest and package versions must match");
}

for (const file of ["background.js", "content-script.js", "popup.js", "options.js", "rules.js"]) {
  new Function(fs.readFileSync(path.join(root, file), "utf8"));
}

const content = fs.readFileSync(path.join(root, "content-script.js"), "utf8");
if (/remove\(\).*cookie|document\.cookie\s*=/.test(content)) {
  throw new Error("Content script must not delete or directly rewrite site cookies");
}

const forbiddenPermissions = ["cookies", "webRequest", "declarativeNetRequest", "history", "tabs"];
const declaredPermissions = new Set([
  ...(manifest.permissions || []),
  ...(manifest.optional_permissions || [])
]);
for (const permission of forbiddenPermissions) {
  if (declaredPermissions.has(permission)) {
    throw new Error(`Privacy boundary violated by permission: ${permission}`);
  }
}

const runtimeFiles = ["background.js", "content-script.js", "popup.js", "options.js", "rules.js"];
const outboundPrimitives = /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/;
for (const file of runtimeFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (outboundPrimitives.test(source)) {
    throw new Error(`Unexpected outbound-network primitive in ${file}`);
  }
}

console.log("validate.cjs: manifest, referenced files, JavaScript syntax, privacy boundaries, and cookie-safety checks passed");
