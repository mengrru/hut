import ResolveConfig from "./configResolver";
import Route from "./router";
import Renderer from "./pageRenderer";
import MdRenderer from "./markdownIt";
import LoadTheme from "./themeLoader";

(async () => {

const Dataset = document.currentScript.dataset;
const ConfigPath = Dataset.config || "config.json";

const userConfig = await ResolveConfig(ConfigPath);

await LoadTheme(userConfig);

const routeRes = await Route(userConfig);
Renderer(MdRenderer, routeRes);

})();
