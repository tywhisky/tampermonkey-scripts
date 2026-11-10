# Tampermonkey Scripts

A collection of Tampermonkey scripts I use regularly.

## Scripts

### [Comic Viewport Fit](./comic-viewport-fit.user.js)

Fits comic images within the browser viewport while preserving their aspect ratio. On Manhuagui's paged reader, it uses the space below the header and brings the comic into view on short windows. The sizing updates when the window is resized and applies to images loaded later.

#### Installation and use

1. Paste the contents of `comic-viewport-fit.user.js` into a new or existing Comic Viewport Fit script in Tampermonkey and save it.
2. On Manhuagui's paged reader, click **Fit image: Off** in the bottom-right corner to turn fitting on. On other sites, you can also use **Toggle Comic Viewport Fit for This Site** from the Tampermonkey menu.
3. Click **Fit image: On** or use the same menu command to turn fitting off. The script remembers the setting for each hostname.

#### Site settings

The script is off by default. It detects Manhuagui's paged reader by its `#mangaBox` element and targets the comic image inside it. On other sites, it defaults to every `<img>` element when enabled. To target a specific reader and show the button on a configured site, add the hostname and a CSS selector to `siteSelectors` near the top of the script. For example, use `['manga.example.com', '.reader img']`.
