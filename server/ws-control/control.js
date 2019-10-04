const router = require("./table");

module.exports = function(command, reply){
  if(router[command]){
    router[command](data=>{
      reply(JSON.stringify({command,data}));
    });
  } else {
    reply(JSON.stringify({error:'command not found'}));
  }
}
