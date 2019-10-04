"use strict";
const nunjucks = require("nunjucks");
const fs = require("fs");
var mkdirp = require("mkdirp");
var getDirName = require("path").dirname;
const util = require("util");
const ncp = require("ncp").ncp;
const injectGzipFiles = require("./FileConverter").injectGzipFiles;

const readFile = util.promisify(fs.readFile);

const { readdir, stat } = require("fs").promises;
const { join } = require("path");

const OUTPUT_DIR = "/home/alex/web/Train/train-test";

module.exports = class Modules {
  dirname = __dirname;
  /**
   *
   * @param {*} config
   */
  constructor(dirname) {
    if (dirname) this.dirname = dirname;
    nunjucks.configure({ autoescape: false });
  }

  createFiles = async config => {
    for (let mod in config) {
      console.log(mod);
      let templates = config[mod].template;
      let modul = config[mod];
      if (templates) {
        console.log(mod.databaseContent);
        templates.forEach(async item => {
          const result = await this.renderTemplate(
            `${this.dirname}/${item.source}`,
            modul,
            config,
            new Date().toISOString()
          );
          this.writeFile(item.destination, result, () => console.log);
        });
      }
    }
    let { files } = config.files;
    files = await injectGzipFiles(files, this.dirname);
    /**
     * TODO: remove repeat code
     */
    files.forEach(async file => {
      const result = await this.renderTemplate(
        `${this.dirname}/${file.template}`,
        file,
        config,
        new Date().toISOString()
      );
      this.writeFile(file.destsource, result, () => console.log);
    });
  };

  makeDirectories = async path => {
    let dirs = [];
    for (const file of await readdir(path)) {
      if ((await stat(join(path, file))).isDirectory()) {
        dirs = [...dirs, file];
      }
    }
    return dirs;
  };

  createMakeFile = async (
    makeProps,
    savePath,
    template = "modules.make.template"
  ) => {
    try {
      const result = await this.renderTemplate(
        `${__dirname}/${template}`,
        makeProps,
        "",
        ""
      );
      console.log(`create ${savePath}/makefile`);
      this.writeFile(`${savePath}/makefile`, result, () => console.log);
    } catch (e) {
      console.log(e);
    }
  };

  async copyFiles(config) {
    const directories = config.migrate.path;
    directories.forEach(dir => {
      ncp.limit = 16;
      ncp(`${this.dirname}/${dir.source}`, dir.dest, err => {
        return err
          ? console.error(err)
          : console.log("files copied successfully");
      });
    });

    const makeDirectories = await this.makeDirectories(OUTPUT_DIR);
    let allObjects = [];
    for (let dir of makeDirectories) {
      const files = await readdir(`${OUTPUT_DIR}/${dir}`);
      const srcFiles = files
        .filter(file => file.includes(".c"))
        .map(file => file.split(".c")[0]);
      allObjects = allObjects.concat(srcFiles);
    }
  }

  renderTemplate = async (path, modul, modules, date) => {
    try {
      console.log(`render ${path}`);
      const templateString = await readFile(path, "utf8");
      const result = nunjucks.renderString(templateString, {
        module: modul,
        modules,
        date
      });
      return result;
    } catch (e) {
      throw e;
    }
  };

  writeFile(path, contents, cb) {
    mkdirp(getDirName(path), function(err) {
      if (err) return cb(err);
      fs.writeFile(path, contents, cb);
    });
  }
};
