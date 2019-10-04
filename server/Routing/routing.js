"use strict";
const pathToRegexp = require("path-to-regexp");

module.exports = class Router {
  routes = [];
  constructor(table) {
    for (let path in table) {
      const route = {
        action: table[path],
        keys: []
      };
      route.regexp = pathToRegexp(path, route.keys);
      this.routes.push(route);
    }
  }

  addRoute(path, action) {
    const route = {
      action,
      keys: []
    };
    route.regexp = pathToRegexp(path, route.keys);
    routes.push(route);
  }

  findRoute(url) {
    let args;
    let route = this.routes.find(route => {
      let res = route.regexp.exec(url);
      if (res) {
        args = res.slice(1);
        return true;
      }
      return false;
    });
    const action = route && route.action;
    return { action, args };
  }
};
