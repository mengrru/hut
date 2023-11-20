import { FrontMatter } from "./types/FrontMatter.d"

export const parseFrontMatter = (text: string): FrontMatter => {
  const res: FrontMatter = {
    title: "", time: "", tags: [], abstract: ""
  }
  if (text.indexOf('<!--') === 0) {
    const raw = text.match(/^<!--(.*?)-->/s)[1]
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
  return res;
}

export const renderFrontMatter =  (frontMatter: FrontMatter): string => {
  let renderedTitle = ''
  let renderedTime = ''
  let renderedTags = ''
  let renderedAbstract = ''

  if (frontMatter.title) {
    renderedTitle = '<h1 class="doc-title">' + frontMatter.title + '</h1>'
  }
  if (frontMatter.time) {
    renderedTime = '<div class="doc-time">' + frontMatter.time + '</div>'
  }
  if (frontMatter.tags.length) {
    for (var i = 0; i < frontMatter.tags.length; i++) {
      renderedTags += '<span class="doc-single-tag">' + frontMatter.tags[i] + '</span>'
    }
    renderedTags = '<div class="doc-tags">' + renderedTags + '</div>'
  }
  if (frontMatter.abstract) {
    renderedAbstract = '\n\n> ' + frontMatter.abstract + '\n\n'
  }
  const renderedInfo = renderedTime + renderedTags
  const res = 
    renderedTitle
    + (renderedInfo ? '<div class="doc-info">' : '')
    + renderedInfo
    + (renderedInfo ? '</div>' : '')
    + renderedAbstract

  return res;
}
