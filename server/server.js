"use strict";

const http = require("http");
const Router = require("./Routing/routing");
const configTable = require("./Routing/table");

const serialazer = require("./serializer");

const HOST = "127.0.0.1";
const PORT = "3000";

const router = new Router(configTable);

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
