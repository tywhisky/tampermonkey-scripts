// ==UserScript==
// @name         Comic Viewport Fit
// @namespace    comic-viewport-fit
// @version      0.3.1
// @description  Fit comic images to the browser viewport while preserving their aspect ratio. Enable it per site.
// @match        *://*/*
// @run-at       document-end
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
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
  let centeredScrollY = 0;
  let style = null;

  function centerMangaBox() {
    const viewportHeight = document.documentElement.clientHeight;
    mangaBox.style.setProperty(heightProperty, `${viewportHeight}px`);
    mangaBox.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    centeredScrollY = window.scrollY;
  }

  function scheduleCenter() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(centerMangaBox);
  }

  function centerOnImageLoad(event) {
    if (event.target.id === 'mangaFile') scheduleCenter();
  }

  function centerOnPageChange() {
    if (!/^#p=\d+$/.test(location.hash)) return;
    // Manhuagui queues a scroll-to-top animation when it changes pages.
    unsafeWindow.jQuery?.('html, body').stop(true);
    scheduleCenter();
  }

  const layoutObserver = mangaBox ? new ResizeObserver(() => {
    // Follow late layout shifts while the reader is still at its automatic position.
    if (Math.abs(window.scrollY - centeredScrollY) <= 1) scheduleCenter();
  }) : null;

  function applyImageStyles() {
    style = GM_addStyle(`
      ${mangaBox ? `
        #mangaBox {
          box-sizing: border-box !important;
          display: grid !important;
          height: var(${heightProperty}, 100vh) !important;
          place-items: center !important;
          overflow-anchor: none;
        }
      ` : ''}
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
      centerMangaBox();
      layoutObserver.observe(document.body);
      mangaBox.addEventListener('load', centerOnImageLoad, true);
      window.addEventListener('hashchange', centerOnPageChange);
      window.addEventListener('pageshow', scheduleCenter);
      window.addEventListener('resize', scheduleCenter);
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
        mangaBox.removeEventListener('load', centerOnImageLoad, true);
        window.removeEventListener('hashchange', centerOnPageChange);
        window.removeEventListener('pageshow', scheduleCenter);
        window.removeEventListener('resize', scheduleCenter);
        cancelAnimationFrame(resizeFrame);
        mangaBox.style.removeProperty(heightProperty);
      }
    } else {
      applyImageStyles();
    }
    GM_setValue(enabledKey, style !== null);
    updateButton();
  }

  if (GM_getValue(enabledKey, Boolean(mangaBox || customSelector))) applyImageStyles();
  updateButton();
  button.addEventListener('click', toggleFit);
  GM_registerMenuCommand('Toggle Comic Viewport Fit for This Site', toggleFit);
})();
