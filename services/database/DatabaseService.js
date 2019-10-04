const nunjucks = require("nunjucks");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const watchFile = util.promisify(fs.watch);

module.exports = class Database {
  databaseConfigMap = null;
  databaseTypedef = "";
  databaseContent = "";

  /**
   * @param {*} moduleDatabase
   * moduleDatabase{
   *  <ModuleName> = { - table name
   *    <key>: <value> ...  - table key-value store
   *  } ...
   * }
   * @returns Map(
   *  <ModuleName>=>{ - table
   *    name: <ModuleName> - table name
   *    value: <ModuleName>
   *    size: <ModuleName> string length - table name size for service needs (bufffer paddings for database typedef structure)
   *    rows: [
   *      name: <ModuleName.key>
   *      value: <ModuleName.key.value>
   *      size: <ModuleName.key.value> string length
   *    ]
   *  }...
   * )
   */
  constructor(moduleDatabase) {
    const structures = new Map();

    const deviceModules = Object.keys(moduleDatabase);
    deviceModules.forEach(mod => {
      let tableName = mod;
      let value = mod;
      let size = mod.length;
      structures.set(tableName, {
        name: tableName,
        value,
        size,
        rows: []
      });
      const modulerows = Object.keys(moduleDatabase[mod]);
      modulerows.forEach(item => {
        let name = item;
        let value = moduleDatabase[mod][item];
        let size = moduleDatabase[mod][item].toString().length;
        structures.get(tableName).rows.push({
          name,
          value,
          size
        });
      });
    });
    this.databaseConfigMap = structures;
    this.loadTemplates();
  }

  loadTemplates = async () => {
    const files = await readDir(__dirname);
    const headerFiles = files
      .filter(file => file.includes(".h.template"))
      .map(file => `${__dirname}/${file}`);
    const sourceFiles = files
      .filter(file => file.includes(".c.template"))
      .map(file => `${__dirname}/${file}`);

    for (let file of headerFiles) {
      this.databaseTypedef = await this.renderDatabaseTemplate(file);
    }

    for (let file of sourceFiles) {
      this.databaseContent = await this.renderDatabaseTemplate(file);
    }
  };

  renderDatabaseTemplate = async templateFile => {
    try {
      console.log(`render ${templateFile}`);
      const templateString = await readFile(templateFile, "utf8");
      return nunjucks.renderString(templateString, {
        db: this.databaseConfigMap
      });
    } catch (e) {
      throw e;
    }
  };

  getJsonMap() {
    return JSON.stringify(Array.from(this.databaseConfigMap.entries()));
  }
};
