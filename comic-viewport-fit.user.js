// ==UserScript==
// @name         Comic Viewport Fit
// @namespace    comic-viewport-fit
// @version      0.2.0
// @description  Fit comic images to the browser viewport while preserving their aspect ratio. Enable it per site.
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
  const customSelector = siteSelectors.get(hostname);
  const mangaBox = customSelector ? null : document.getElementById('mangaBox');
  // shortcut: The fallback matches every image. Add a site-specific selector to target the comic reader.
  const selector = customSelector ?? (mangaBox ? '#mangaBox img#mangaFile' : 'img');
  const heightProperty = '--comic-viewport-fit-height';
  let resizeFrame = 0;
  let style = null;

  function fitMangaBox(reveal = false) {
    const viewportHeight = document.documentElement.clientHeight;
    let top = mangaBox.getBoundingClientRect().top;
    // Bring the comic into view if it is clipped or the header takes most of the window.
    if ((reveal && top < 0) || top > viewportHeight / 2) {
      mangaBox.scrollIntoView({ block: 'start', behavior: 'instant' });
      top = mangaBox.getBoundingClientRect().top;
    }
    const height = Math.max(1, Math.floor(viewportHeight - Math.max(0, top)));
    mangaBox.style.setProperty(heightProperty, `${height}px`);
  }

  function scheduleFit() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => fitMangaBox());
  }

  const layoutObserver = mangaBox ? new ResizeObserver(scheduleFit) : null;

  function applyImageStyles() {
    style = GM_addStyle(`
      ${selector} {
        max-height: 100vh !important;
        max-height: 100dvh !important;
        object-fit: contain !important;
        ${mangaBox ? `
          box-sizing: border-box !important;
          width: auto !important;
          height: auto !important;
          min-width: 0 !important;
          min-height: 0 !important;
          max-width: min(100%, 100vw) !important;
          max-height: var(${heightProperty}, 100vh) !important;
        ` : ''}
      }
    `);
    if (mangaBox) {
      fitMangaBox(true);
      layoutObserver.observe(document.body);
      window.addEventListener('resize', scheduleFit);
    }
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'Fit comic image to window');
  button.style.cssText = `
    position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
    padding: 8px 12px; border: 1px solid #fff; border-radius: 6px;
    background: #222; color: #fff; font: 14px/1.4 system-ui, sans-serif;
    cursor: pointer;
  `;

  function updateButton() {
    button.textContent = style ? 'Fit image: On' : 'Fit image: Off';
    button.setAttribute('aria-pressed', String(style !== null));
    if (!button.isConnected && (mangaBox || customSelector || style)) {
      document.body.append(button);
    }
  }

  function toggleFit() {
    if (style) {
      style.remove();
      style = null;
      if (mangaBox) {
        layoutObserver.disconnect();
        window.removeEventListener('resize', scheduleFit);
        cancelAnimationFrame(resizeFrame);
        mangaBox.style.removeProperty(heightProperty);
      }
    } else {
      applyImageStyles();
    }
    GM_setValue(enabledKey, style !== null);
    updateButton();
  }

  if (GM_getValue(enabledKey, false)) applyImageStyles();
  updateButton();
  button.addEventListener('click', toggleFit);
  GM_registerMenuCommand('Toggle Comic Viewport Fit for This Site', toggleFit);
})();
