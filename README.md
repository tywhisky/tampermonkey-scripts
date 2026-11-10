# Tampermonkey Scripts

A collection of Tampermonkey scripts I use regularly.

## Scripts

### [Comic Viewport Fit](./comic-viewport-fit.user.js)

Fits comic images within the browser viewport while preserving their aspect ratio. On Manhuagui's paged reader, it automatically centers the full comic image when the page opens or the reader loads another image. The sizing updates when the window is resized.

#### Installation and use

1. Paste the contents of `comic-viewport-fit.user.js` into a new or existing Comic Viewport Fit script in Tampermonkey and save it.
2. On Manhuagui's paged reader, fitting starts enabled. Use the button in the bottom-right corner or **Toggle Comic Viewport Fit for This Site** from the Tampermonkey menu to change it.
3. The script remembers your choice for each hostname.

#### Site settings

Fitting is on by default on Manhuagui's paged reader and on sites you configure in `siteSelectors`. To configure a site, add the hostname and a CSS selector near the top of the script. For example, use `['manga.example.com', '.reader img']`. On other sites, fitting is opt-in through the Tampermonkey menu and applies to every `<img>` element.
