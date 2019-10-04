const Database = require("./services/database/DatabaseService");
const Modules = require("./services/modules/ModuleService");
const Config = require("./services/LoadConfig");

const hoconConfig = "../train-config/Config/Tests/Node.conf";

const { spawn } = require("child_process");
/**
 * TODO: roadmap
 * generate build.sh
 * watch and rebuild
 */
(async () => {
  const child = spawn("../Tests/output/out");
  child.stdout.on("data", function(data) {
    process.stdout.write(`${data.toString()}\n`);
  });

  const config = await Config.load(hoconConfig);
  const database = new Database(config.moduleDatabase);
  await database.loadTemplates();
  config.database = { ...config.database, ...database };
  const modules = new Modules("../train-config");
  modules.createFiles(config);
  modules.copyFiles(config);
})();
