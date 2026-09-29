(function initNecessaryCookieRules(root, factory) {
  const rules = factory();
  root.NCO_RULES = rules;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = rules;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function buildRules() {
  "use strict";

  const normalizeText = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .replace(/[\s\u00a0]+/g, " ")
    .replace(/[“”„‟'’`´]/g, "")
    .trim()
    .toLowerCase();

  const rejectPatterns = [
    /^(reject|decline|deny|refuse)( all)?( cookies)?$/,
    /^(reject|decline) (optional|non[- ]essential) cookies$/,
    /^(only|use only|allow only|continue with) (necessary|required|essential)( cookies)?$/,
    /^continue without (accepting|agreeing)$/,
    /^(alle|alles) ablehnen$/,
    /^nur (notwendige|erforderliche|essenzielle)( cookies)?( zulassen|akzeptieren)?$/,
    /^(ablehnen|nicht zustimmen)$/,
    /^(tout refuser|refuser tout|continuer sans accepter)$/,
    /^(rejeter|refuser) les cookies non essentiels$/,
    /^(rechazar|rechazar todo|rechazar todos|denegar todo)$/,
    /^(solo|solamente) (cookies )?(necesarias|esenciales)$/,
    /^(rifiuta tutti|rifiuta tutto|solo necessari|solo cookie necessari)$/,
    /^(alles weigeren|alles afwijzen|alleen noodzakelijke cookies)$/,
    /^(odrzuc wszystkie|tylko niezbedne|tylko niezbedne pliki cookie)$/,
    /^(rejeitar tudo|recusar tudo|apenas cookies necessarios)$/,
    /^(avvisa alla|endast nodvandiga|kun nodvendige)$/,
    /^(拒绝全部|全部拒绝|拒绝所有|仅必要|仅允许必要|只允许必要|仅接受必要|只接受必要)$/,
    /^(必要なもののみ|すべて拒否|必須のみ)$/,
    /^(필수만|모두 거부|필수 쿠키만)$/
  ];

  const settingsPatterns = [
    /^(manage|manage choices|manage options|manage preferences)$/,
    /^(settings|cookie settings|privacy settings)$/,
    /^(customize|customise|customize choices|customise choices)$/,
    /^(options|more options|show options|set preferences)$/,
    /^(einstellungen|cookie[- ]einstellungen|auswahl anpassen|anpassen)$/,
    /^(parametres|gerer mes choix|personnaliser|plus doptions)$/,
    /^(configurar|configuracion|administrar preferencias|personalizar)$/,
    /^(impostazioni|gestisci preferenze|personalizza)$/,
    /^(instellingen|voorkeuren beheren|aanpassen)$/,
    /^(ustawienia|zarzadzaj preferencjami|dostosuj)$/,
    /^(设置|管理选项|管理偏好|自定义|更多选项|cookie设置|隐私设置)$/,
    /^(設定|選択肢を管理|カスタマイズ)$/,
    /^(설정|선택 관리|환경 설정)$/
  ];

  const turnOffPatterns = [
    /^(turn|switch|disable) (them )?all off$/,
    /^(turn off all|disable all|deselect all)$/,
    /^(alle deaktivieren|alles ausschalten|alle ausschalten)$/,
    /^(tout desactiver|desactiver tout)$/,
    /^(desactivar todo|deshabilitar todo)$/,
    /^(disattiva tutto|deseleziona tutto)$/,
    /^(alles uitschakelen|alles uit)$/,
    /^(wylacz wszystko|odznacz wszystko)$/,
    /^(关闭所有|全部关闭|全部停用|取消全选)$/,
    /^(すべてオフ|すべて無効)$/,
    /^(모두 끄기|모두 비활성화)$/
  ];

  const savePatterns = [
    /^(save|save choices|save settings|save preferences|confirm choices)$/,
    /^(auswahl speichern|einstellungen speichern|speichern)$/,
    /^(enregistrer|enregistrer mes choix|confirmer mes choix)$/,
    /^(guardar|guardar seleccion|guardar preferencias)$/,
    /^(salva|salva preferenze|conferma scelte)$/,
    /^(opslaan|keuzes opslaan|voorkeuren opslaan)$/,
    /^(zapisz|zapisz wybor|zapisz preferencje)$/,
    /^(保存|保存选择|保存设置|确认选择)$/,
    /^(保存する|選択を保存)$/,
    /^(저장|선택 저장)$/
  ];

  const consentContextPatterns = [
    /cookie/, /consent/, /privacy/, /tracking/, /advertis/, /gdpr/, /cmp/,
    /datenschutz/, /einwilligung/, /zustimmung/,
    /confidentialite/, /consentement/,
    /privacidad/, /consentimiento/,
    /隐私/, /同意/, /追踪/, /广告/, /必要/,
    /プライバシー/, /同意/, /개인정보/, /동의/
  ];

  const necessaryPatterns = [
    /necessary/, /required/, /essential/, /strictly necessary/,
    /notwendig/, /erforderlich/, /essenziell/,
    /necessaire/, /requis/, /esencial/, /necesari/,
    /necessari/, /noodzakelijk/, /niezbedn/,
    /必要/, /必須/, /필수/
  ];

  const optionalCategoryPatterns = [
    /advertis/, /marketing/, /analytics?/, /measurement/, /personalization/,
    /functional/, /preferences?/, /social media/, /targeting/, /performance/,
    /werbung/, /marketing/, /analyse/, /personalisierung/, /komfort/,
    /publicite/, /mesure/, /personnalisation/,
    /publicidad/, /analitica/, /personalizacion/,
    /pubblicita/, /analisi/, /personalisierung/,
    /广告/, /营销/, /分析/, /个性化/, /偏好/, /社交媒体/,
    /広告/, /分析/, /マーケティング/, /광고/, /분석/, /마케팅/
  ];

  const acceptPatterns = [
    /^(accept|allow|agree)( all)?( cookies)?$/,
    /^(accept all|allow all|agree and continue)$/,
    /^(alle akzeptieren|alles akzeptieren|zustimmen)$/,
    /^(tout accepter|accepter tout)$/,
    /^(aceptar todo|permitir todo)$/,
    /^(accetta tutto|consenti tutto)$/,
    /^(全部接受|接受全部|全部允许|同意全部)$/,
    /^(すべて許可|すべて同意)$/,
    /^(모두 허용|모두 동의)$/
  ];

  const knownRejectSelectors = [
    "#onetrust-reject-all-handler",
    "#CybotCookiebotDialogBodyButtonDecline",
    "#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll",
    "#didomi-notice-disagree-button",
    "button[id*='didomi-notice-disagree']",
    ".cky-btn-reject",
    ".cmplz-deny",
    ".cn-decline",
    ".osano-cm-denyAll",
    ".osano-cm-deny",
    ".t-declineAllButton",
    "[data-tid='banner-decline']",
    ".iubenda-cs-reject-btn",
    "#iubenda-cs-reject-btn",
    ".borlabs-cookie-refuse",
    "[data-cookie-refuse]",
    "#cookiescript_reject",
    "#shopify-pc__banner__btn-decline",
    "#ccc-reject-settings",
    "[data-action='cookie-consent#rejectAll']",
    "[aria-label='Do not consent']",
    "#sp-cc-rejectall-link"
  ];

  const knownSettingsSelectors = [
    "#onetrust-pc-btn-handler",
    "#CybotCookiebotDialogBodyLevelButtonCustomize",
    "[data-cky-tag='settings-button']",
    ".cmplz-manage-consent",
    "#sp-cc-customize"
  ];

  const knownTurnOffSelectors = [
    "#turn-off-all-button-announce",
    "button[data-testid='reject-all']",
    "button[aria-label='Reject all']"
  ];

  const consentContainerSelector = [
    "[role='dialog']",
    "[aria-modal='true']",
    "[id*='cookie' i]",
    "[class*='cookie' i]",
    "[id*='consent' i]",
    "[class*='consent' i]",
    "[id*='privacy' i]",
    "[class*='privacy' i]",
    "[id*='cmp' i]",
    "[class*='cmp' i]",
    "aside",
    "dialog"
  ].join(",");

  const clickableSelector = [
    "button",
    "[role='button']",
    "input[type='button']",
    "input[type='submit']",
    "a"
  ].join(",");

  const matchesAny = (value, patterns) => {
    const text = normalizeText(value);
    return patterns.some((pattern) => pattern.test(text));
  };

  return {
    normalizeText,
    matchesAny,
    rejectPatterns,
    settingsPatterns,
    turnOffPatterns,
    savePatterns,
    consentContextPatterns,
    necessaryPatterns,
    optionalCategoryPatterns,
    acceptPatterns,
    knownRejectSelectors,
    knownSettingsSelectors,
    knownTurnOffSelectors,
    consentContainerSelector,
    clickableSelector
  };
});
