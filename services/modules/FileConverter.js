const { gzip, ungzip } = require("node-gzip");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);

(bufferReduceToStryngCppArray = async buffer => {
  const array = new Uint8Array(buffer);
  return array.reduce((result, number, index, array) => {
    let stringNumber = number.toString(16).toUpperCase();

    stringNumber =
      stringNumber.length < 2 ? "0x0" + stringNumber : "0x" + stringNumber;

    result =
      result +
      stringNumber +
      (index < array.length - 1 ? ", " : "") +
      ((index + 1) % 15 ? "" : "\r\n\t\t");
    return result;
  }, "\t\t");
}),
  (stringToGzipBuffer = async filePath => {
    const fileData = await readFile(filePath, "utf8");
    return await gzip(fileData);
  }),
  (module.exports = {
    injectGzipFiles: async (files, dirname) => {
      for (let file of files) {
        console.log(`file to gzip ${dirname}/${file.source}`);
        const buffer = await stringToGzipBuffer(`${dirname}/${file.source}`);
        file.arraySize = buffer.length;
        file.array = await bufferReduceToStryngCppArray(buffer);
      }
      return files;
    }
  });
