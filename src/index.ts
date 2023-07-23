import MarkdownIt from "markdown-it";
import MarkdownItTocDoneRight from "markdown-it-toc-done-right";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItContainer from "markdown-it-container";
import MarkdownItAnchor from "markdown-it-anchor";
import { UserConfig } from "./types/UserConfig.d"
import { FrontMatter } from "./types/FrontMatter.d"

export const Load = (Config: UserConfig) => {
  document.title = Config.defaultTitle || 'Quick Markdown'
  const notFoundMessage = Config.notFoundText || '404 not found'

  const hash = window.location.hash.substring(1)
  var query = window.location.search.substring(1).split('&')[0]
  if (!query || query === Config.homepage.split('.')[0]) {
    document.getElementById('footer-buttons').style.display = 'none'
  }

  function loadPage (mdRender, query, errfn, finishedCallback?) {
    loadFile(resolveQuery(query, true), function (data) {
      renderPage(data, mdRender)
      typeof finishedCallback === 'function'
        && finishedCallback()
    }, function () {
      loadFile(resolveQuery(query, false), function (data) {
        renderPage(data, mdRender)
        typeof finishedCallback === 'function'
          && finishedCallback()
      }, function () {
        typeof errfn === 'function' ? errfn() : ''
        typeof finishedCallback === 'function'
          && finishedCallback()
      })
    })
  }
  function load404 (mdRender) {
    document.title = '404'
    if (Config.notFoundPage) {
      loadPage(mdRender, Config.notFoundPage, function () {
        document.getElementById('article').innerHTML = '<p style="text-align: center;">' + notFoundMessage + '</p>'
      })
    } else {
      document.getElementById('article').innerHTML = '<p style="text-align: center;">' + notFoundMessage + '</p>'
    }
  }
  function renderPage (data, mdRender) {
    document.getElementById('article').innerHTML = mdRender.render(renderFrontMatter(data))
    try {
      document.title = document.getElementsByClassName('doc-title')[0].textContent
    } catch (_) {}
  }
  function resolveQuery (query: string, isFileName: boolean) {
    if (query.substring(query.length - 3) === '.md') {
      return Config.docRoot + query
    }
    return query
      ? decodeURIComponent(Config.docRoot + query + (isFileName ? '.md' : '/index.md'))
      : resolveQuery(Config.homepage || 'index.md', false)
  }

  function loadFile (path, fn, errfn) {
    const request = new XMLHttpRequest()
    request.open('get', path)
    request.send(null)
    request.onload = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          fn(request.responseText)
        } else {
          console.warn('Load file ' + path + ' failed.')
          typeof errfn === 'function' ? errfn() : ''
        }
      }
    }
  }

  function renderFrontMatter (content: string) {
    const res: FrontMatter = {
      title: "", time: "", tags: [], abstract: ""
    }
    if (content.indexOf('<!--') === 0) {
      const raw = content.match(/^<!--(.*?)-->/s)[1]
      raw.split('\n')
        .forEach(e => {
          if (e.replace(' ', '').length === 0) {
            return
          }
          const d = e.split(':')
          const key = d[0].replace(' ', '')
          const value = d.slice(1).join('').replace(/^ /, '') 
          if (key === "tags") {
            res[key] = value.split(' ')
          } else {
            res[key] = value
          }
        })
    }

    let renderedTitle = ''
    let renderedTime = ''
    let renderedTags = ''
    let renderedAbstract = ''

    if (res.title) {
      renderedTitle = '<h1 class="doc-title">' + res.title + '</h1>'
    }
    if (res.time) {
      renderedTime = '<div class="doc-time">' + res.time + '</div>'
    }
    if (res.tags.length) {
      for (var i = 0; i < res.tags.length; i++) {
        renderedTags += '<span class="doc-single-tag">' + res.tags[i] + '</span>'
      }
      renderedTags = '<div class="doc-tags">' + renderedTags + '</div>'
    }
    if (res.abstract) {
      renderedAbstract = '\n\n> ' + res.abstract + '\n\n'
    }
    const renderedInfo = renderedTime + renderedTags
    const rendered = 
      renderedTitle
      + (renderedInfo ? '<div class="doc-info">' : '')
      + renderedInfo
      + (renderedInfo ? '</div>' : '')
      + renderedAbstract
      + '\n\n'

    return rendered + content
  }


  const md = MarkdownIt({
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
  })
  md.use(MarkdownItAnchor, {
    level: 1,
    permalink: false,
    containerId:"header-toc"
  }).use(MarkdownItTocDoneRight, {
    level: [1, 2]
  })
    .use(MarkdownItMark)
    .use(MarkdownItContainer, 'tips')
    .use(MarkdownItContainer, 'warning')

  loadPage(md, query, function () {
    load404(md)
  }, function () {
    document.getElementsByTagName('body')[0].style.visibility = 'visible'
    if (hash) window.location.href = "#" + hash
  })
}
