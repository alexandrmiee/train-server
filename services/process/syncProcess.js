const { spawn } = require("child_process");
const JSON5 = require('json5');


module.exports = async (onMessage) => {
  const child = spawn("/home/alex/web/Train/train-test/output/out");
  child.stdout.on("data", (data) => {
    const stringData = data.toString();
    try{
      stringData.split('\n').forEach(line => {
        process.stdout.write(`\x1b[32mread new line sizeof ${line.length}:\x1b[0m\r\n${line}\r\n\r\n`);
        if(line.length) {
          const result = JSON5.parse(line);
          if(onMessage) onMessage(result);
        }
      });
    } catch(e) {
      process.stdout.write(e.toString());
      if(onMessage) onMessage(JSON.stringify({error: e}));
    } 
  });
  
  child.stdin.setEncoding('utf-8');
  child.stdin.write("console.log('Hello from PhantomJS')\r\n");
  child.stdin.end();
};