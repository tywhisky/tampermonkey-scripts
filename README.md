# Comic Viewport Fit · 漫画图片适屏

将漫画图片的高度限制在浏览器当前可视区域内，保持原图比例。窗口大小变化或网站继续加载图片时，规则会自动生效。

## 安装和使用

1. 在 Tampermonkey 中新建脚本，粘贴 `comic-viewport-fit.user.js` 的全部内容并保存。
2. 打开漫画阅读页，点击 Tampermonkey 图标，选择「切换本站漫画图片适屏」。
3. 脚本会记住该域名的设置。再次点击同一菜单项可关闭。

## 适配站点

脚本默认关闭。开启后，通用规则匹配该域名下页面中的所有 `<img>`。如果只想调整漫画正文，可在脚本开头的 `siteSelectors` 中添加域名及阅读区图片的 CSS 选择器，例如 `['manga.example.com', '.reader img']`。
