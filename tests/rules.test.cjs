"use strict";

const assert = require("node:assert/strict");
const R = require("../rules.js");

const positiveReject = [
  "Reject all",
  "Only necessary cookies",
  "Alle ablehnen",
  "Nur notwendige Cookies",
  "Tout refuser",
  "Rechazar todo",
  "Rifiuta tutti",
  "Alles weigeren",
  "Odrzuć wszystkie",
  "拒绝全部",
  "仅允许必要",
  "すべて拒否",
  "모두 거부"
];

for (const value of positiveReject) {
  assert.equal(R.matchesAny(value, R.rejectPatterns), true, `Expected reject match: ${value}`);
}

const neverReject = ["Accept all", "Allow all", "全部接受", "Buy now", "Continue shopping"];
for (const value of neverReject) {
  assert.equal(R.matchesAny(value, R.rejectPatterns), false, `Unexpected reject match: ${value}`);
}

for (const value of ["Cookie settings", "Anpassen", "管理偏好", "Manage choices"]) {
  assert.equal(R.matchesAny(value, R.settingsPatterns), true, `Expected settings match: ${value}`);
}

for (const value of ["Save choices", "Auswahl speichern", "保存选择"]) {
  assert.equal(R.matchesAny(value, R.savePatterns), true, `Expected save match: ${value}`);
}

assert.equal(R.matchesAny("Accept all", R.acceptPatterns), true);
assert.equal(R.matchesAny("Strictly necessary", R.necessaryPatterns), true);
assert.equal(R.matchesAny("Marketing and analytics", R.optionalCategoryPatterns), true);

console.log(`rules.test.cjs: ${positiveReject.length + neverReject.length + 4 + 3 + 3} assertions passed`);
