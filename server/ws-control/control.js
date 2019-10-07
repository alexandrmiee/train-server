const router = require("./table");
const mock = require("./__mock__/wsdata")();

module.exports = function(command, reply){
  try{
    reply(JSON.stringify(mock.next()));
    setInterval(()=> reply(JSON.stringify(mock.next())), 5000);
  } catch(e){
    console.log(e)
  }
  // if(router[command]){
  //   router[command](data=>{
  //     reply(JSON.stringify({command,data}));
  //   });
  // } else {
  //   reply(JSON.stringify({error:'command not found'}));
  // }
}
