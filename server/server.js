"use strict";
const http = require("http");
const WebSocketServer = require('websocket').server;
const wsControl = require("./ws-control/control");

const Router = require("./Routing/routing");
const configTable = require("./Routing/table");
const serialazer = require("./serializer");
const router = new Router(configTable);

const HOST = "127.0.0.1";
const PORT = "3000";


const server = http
  .createServer(async (req, res) => {
    const data = router.findRoute(req.url);
    const result = await serialazer(data.action, req, res, data.args);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "origin, content-type, accept"
    );
    res.end(result);
  })
  .listen(PORT);

server.on("clientError", (error, socket) => {});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});


wsServer.on('request', function(request) {
  try{
    const connection = request.accept(null, request.origin);
    connection.on('message', function(data) {
      console.log(data)
      const message = JSON.parse(data.utf8Data)
      wsControl(message.command,connection.send.bind(this));
    });
    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    connection.on('error', (...args) => {
      console.log(args);    
    });
    
  } catch(e){
    console.error(e)
  }
});