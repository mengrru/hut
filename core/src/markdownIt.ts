import MarkdownIt from "markdown-it/dist/markdown-it";
import MarkdownItTocDoneRight from "markdown-it-toc-done-right";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItContainer from "markdown-it-container";
import MarkdownItAnchor from "markdown-it-anchor";

export default MarkdownIt({
  html: true,
  /*
  highlight: function (str, lang) {
    if (lang && hljs && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang }).value
          + '</code></pre>'
      } catch (_) {}
    }
    return '<pre class="hljs"><code>' +
      md.utils.escapeHtml(str)
      + '</code></pre>'
  }
  */
}).use(MarkdownItAnchor, {
  level: 1,
  permalink: false,
  containerId:"header-toc"
}).use(MarkdownItTocDoneRight, {
  level: [1, 2]
})
  .use(MarkdownItMark)
  .use(MarkdownItContainer, 'tips')
  .use(MarkdownItContainer, 'warning')

