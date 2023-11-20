import { UserConfig } from "./types/UserConfig.d"

type FilePath = string;

export default async (userConfig: UserConfig): Promise<{ pageContent: string, status: number }> => {
  const DocsDir = userConfig.docsDir;
  const HomepagePath = userConfig.homepage;
  const NotFoundPageFullPath = DocsDir + userConfig.notFoundPage;
  const PathQuery = window.location.search.substring(1).split('&')[0];

  const parsePathQuery = (query: string, isFile: boolean): FilePath => {
    if (query.substring(query.length - 3) === '.md') {
      return DocsDir + query;
    }
    return query
      ? decodeURIComponent(DocsDir + query + (isFile ? '.md' : '/index.md'))
      : parsePathQuery(HomepagePath || 'index.md', true);
  }

  const Path1 = parsePathQuery(PathQuery, true);
  const Path2 = parsePathQuery(PathQuery, false);

  const LoadPath1 = await fetch(Path1);

  if (LoadPath1.status < 400) {
    const pageContent = await LoadPath1.text();
    return { pageContent, status: LoadPath1.status };
  }

  const LoadPath2 = await fetch(Path2);

  if (LoadPath2.status < 400) {
    const pageContent = await LoadPath2.text();
    return { pageContent, status: LoadPath2.status };
  }

  const Load404Page = await fetch(NotFoundPageFullPath);

  if (Load404Page.status < 400) {
    const pageContent = await Load404Page.text();
    return { pageContent, status: 404 };
  }

  return { pageContent: "404 Not found", status: 404 };
};

