const fs = require("fs");
const parser = require("@pushcorn/hocon-parser");
const util = require('util');

const readFile = util.promisify(fs.readFile);

module.exports = class Config{
  static load = async (templateFile) => {
    const text = await readFile(templateFile, "utf8");
    return await parser.parse({ text })
  }
}
