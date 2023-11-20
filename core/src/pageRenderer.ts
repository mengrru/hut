import MarkdownIt from "markdown-it";
import Route from "./router";
import { parseFrontMatter, renderFrontMatter } from "./frontMatterRenderer";

export default async (mdRender: MarkdownIt, routeRes: Awaited<Promise<ReturnType<typeof Route>>>) => {
  const RenderedDOMId = "hut-content";
  const { pageContent, status } = routeRes;

  if (!document.getElementById(RenderedDOMId)) {
    const targetDOM = document.createElement("div");
    targetDOM.id = RenderedDOMId;
    document.body.appendChild(targetDOM);
  }

  if (status >= 400) {
    document.getElementById(RenderedDOMId).innerHTML = mdRender.render(pageContent);
    document.title = "404 - " + document.title;
    return ;
  }

  const frontMatterHTML = renderFrontMatter(parseFrontMatter(pageContent));
  const FullContent = `${frontMatterHTML}\n\n${pageContent}`;

  document.getElementById(RenderedDOMId).innerHTML = mdRender.render(FullContent);

  const DocTitle = document.getElementsByClassName('doc-title')?.[0]?.textContent;
  document.title = `${DocTitle ? DocTitle + " - " : ""}${document.title}`;

  const Hash = window.location.hash;
  if (Hash) {
    window.location.href = "#" + Hash;
  }
}
