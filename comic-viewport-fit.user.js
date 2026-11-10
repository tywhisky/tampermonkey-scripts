// ==UserScript==
// @name         Comic Viewport Fit
// @namespace    comic-viewport-fit
// @version      0.1.0
// @description  Fit comic images to the browser viewport height while preserving their aspect ratio. Enable it per site.
// @match        *://*/*
// @run-at       document-end
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {
  'use strict';

  const siteSelectors = new Map([
    // ['manga.example.com', '.reader img'],
  ]);
  const hostname = location.hostname;
  const enabledKey = `enabled:${hostname}`;
  // shortcut: The default selector matches every image. Add a site-specific selector to target the comic reader.
  const selector = siteSelectors.get(hostname) ?? 'img';

  function applyImageStyles() {
    return GM_addStyle(`
      ${selector} {
        max-height: 100vh !important;
        max-height: 100dvh !important;
        object-fit: contain !important;
      }
    `);
  }

  let style = GM_getValue(enabledKey, false) ? applyImageStyles() : null;

  GM_registerMenuCommand('Toggle Comic Viewport Fit for This Site', () => {
    if (style) {
      style.remove();
      style = null;
    } else {
      style = applyImageStyles();
    }
    GM_setValue(enabledKey, style !== null);
  });
})();
