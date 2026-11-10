// ==UserScript==
// @name         漫画图片适屏 · Comic Viewport Fit
// @namespace    comic-viewport-fit
// @version      0.1.0
// @description  将漫画图片等比缩放到浏览器可视区域的高度以内，按站点开启。
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
  // shortcut: 通用规则匹配本站所有 img。有专用阅读区时可为该域名指定选择器。
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

  GM_registerMenuCommand('切换本站漫画图片适屏', () => {
    if (style) {
      style.remove();
      style = null;
    } else {
      style = applyImageStyles();
    }
    GM_setValue(enabledKey, style !== null);
  });
})();
