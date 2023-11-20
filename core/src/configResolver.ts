import { UserConfig } from "./types/UserConfig.d"

export default async (configPath: string) => {
  const userConfig = JSON.parse(
    await fetch(configPath)
      .then(res => res.text())
      .catch(e => {
        console.log(e);
      })
    || ""
  ) as UserConfig;

  if (!userConfig.docsDir) {
    throw new Error("'docsDir' is invalid.");
  }

  userConfig.renderedDOMId = userConfig.renderedDOMId || "hut-body";
  userConfig.rootPath = userConfig.rootPath || "/";

  return userConfig;
}
