const Database = require("./services/database/DatabaseService");
const Modules = require("./services/modules/ModuleService");
const Config = require("./services/LoadConfig");
const JSON5 = require('json5');

const hoconConfig = "../train-config/Config/Tests/Node.conf";
const script = require("./services/process/syncProcess");
// script((data)=>{console.dir(data)});
/**
 * TODO: roadmap
 * generate build.sh
 * watch and rebuild
 */
(async () => {
  const config = await Config.load(hoconConfig);
  const database = new Database(config.moduleDatabase);
  await database.loadTemplates();
  config.database = { ...config.database, ...database };
  const modules = new Modules("../train-config");
  modules.createFiles(config);
  modules.copyFiles(config);
})();
