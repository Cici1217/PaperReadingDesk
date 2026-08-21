"use strict";

window.MathJax = {
  loader: {
    // MathJax 4 otherwise resolves its New Computer Modern font package from
    // a CDN. Keep dynamic glyph tables and WOFF2 files on the same origin so
    // formula rendering also works offline and under the strict CSP.
    paths: { fonts: "/vendor/mathjax-fonts" },
  },
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
  },
  output: {
    displayOverflow: "linebreak",
    linebreaks: { inline: true, width: "100%", lineleading: 0.2 },
  },
  options: { enableMenu: false },
};
