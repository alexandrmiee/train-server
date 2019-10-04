"use strict";

const Config = require("../../services/LoadConfig");
const hoconConfig = "../train-config/Config/Tests/Node.conf";
const config = async () => await Config.load(hoconConfig);
const modules = async () => Object.keys(await config());
const getModule = async name => {
  let config = await Config.load(hoconConfig);
  return config[name];
};

const Database = require("../../services/database/DatabaseService");
const database = async () => {
  return config.moduleDatabase;
};

const Modules = require("../../services/modules/ModuleService");
const getModuleTemplate = async name => {
  let config = await Config.load(hoconConfig);
  const modules = new Modules(config, "../train-config");
  return await modules.renderTemplate(
    config[name].template[0].source,
    config[name],
    config,
    new Date()
  );
};

module.exports = {
  "/config": config,
  "/modules": modules,
  "/modules/:name": getModule,
  "/modules/:name/template": getModuleTemplate,
  "/modules/:name/result/:type": getModule,
  "/modules/:name/config": getModule
};
