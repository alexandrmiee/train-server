"use strict";

const types = {
  object: JSON.stringify,
  string: s => s,
  function: async (fn, req, res, args) =>
    JSON.stringify(await fn(args, req, res)),
  undefined: () => "not found"
};

module.exports = async (data, req, res, args) => {
  console.log(args);
  return await types[typeof data](data, req, res, args);
};
