import { UserConfig } from "./types/UserConfig.d"
import { setInnerHTML } from "./utils"

export default async (userConfig: UserConfig) => {
  const bodyRenderDOMId = userConfig.renderedDOMId;

  if (!document.getElementById(bodyRenderDOMId)) {
    const targetDOM = document.createElement("div");
    targetDOM.id = bodyRenderDOMId;
    document.body.appendChild(targetDOM);
  }

  document.getElementById(bodyRenderDOMId).style.visibility = "hidden";

  const themeNameFromQueryString = 
    window.location.search
    .slice(1).split('&')
    .slice(1).map(e => e.split('='))
    .filter(e => e?.[0] === 'theme')[0]?.[1]

  const themeNameFromConfig = userConfig.theme;

  const themeRootPath = window.location.pathname +
    (
      (themeNameFromQueryString && 'themes/' + themeNameFromQueryString)
      || (themeNameFromConfig && 'themes/' + themeNameFromConfig)
    )

  const linkTag = loadCSS(themeRootPath + '/index.css');

  linkTag.onload = () => {
      document.getElementById(bodyRenderDOMId).style.visibility = "unset";
  }

  return fetch(themeRootPath + '/body.html')
    .then(res => res.text())
    .then(data => {
      setInnerHTML(document.getElementById(bodyRenderDOMId), data);
    })
    .catch((e) => { console.log(e); });
}

const loadCSS = (cssUrl: string) => {
  if (!cssUrl) {
    return ;
  }
  const head = document.getElementsByTagName('head')[0];
  const linkTag = document.createElement('link');
  linkTag.type = 'text/css';
  linkTag.rel = 'stylesheet';
  linkTag.href = cssUrl;
  head.appendChild(linkTag);
  return linkTag;
} 
