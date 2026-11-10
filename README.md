# Tampermonkey Scripts

A collection of Tampermonkey scripts I use regularly.

## Scripts

### [Comic Viewport Fit](./comic-viewport-fit.user.js)

Keeps comic images within the browser viewport height while preserving their aspect ratio. The sizing adjusts when the window is resized and also applies to images loaded later.

#### Installation and use

1. Create a new script in Tampermonkey, paste the contents of `comic-viewport-fit.user.js`, and save it.
2. Open a comic reading page, click the Tampermonkey icon, and select **Toggle Comic Viewport Fit for This Site**.
3. The script remembers the setting for that hostname. Select the same menu command again to turn it off.

#### Site settings

The script is off by default. When enabled, it applies to every `<img>` element on pages with that hostname. To limit it to images in the comic reader, add the hostname and a CSS selector to `siteSelectors` near the top of the script. For example, use `['manga.example.com', '.reader img']`.
