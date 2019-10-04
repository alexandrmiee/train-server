const { spawn } = require("child_process");

module.exports = async (onMessage) => {
  const child = spawn("/home/alex/web/Train/train-test/output/out");
  child.stdout.on("data", function(data) {
    process.stdout.write(`${data.toString()}\n`);
    onMessage(data.toString());
  });
};