'use strict';
/*jslint unparam: true, indent:2, nomen: true, plusplus: true, vars: true */
var lexer = require('./lexer');

var lexerCache = {};

function wrapConnect(conn) {
  conn.real_query = conn.query;
  conn.query = function (text, params, callback) {
    var stackObj = {};
    Error.captureStackTrace(stackObj);
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    try {
      var tokens, script,  i = 0, param_names;
      if (lexerCache[text]) {
        param_names = lexerCache[text].param_names;
        script = lexerCache[text].script;
      } else {
        tokens = lexer.tokenize(text);
        param_names = [];
        script = text;
        tokens.forEach(function (token) {
          if (token[0] === 'VAR') {
            i = i + 1;
            if (conn.adapter.name === 'postgres') {
              script = script.replace(token[1], '$' + i);
            } else {
              script = script.replace(token[1], '?');
            }
            param_names.push(token[1].substr(1, token[1].length));
          }
        });
        lexerCache[text] = {
          param_names: param_names,
          script: script
        };
      }
      var prm = [];
      param_names.forEach(function (name) {
        if (params[name] === undefined) {
          prm.push(null);
        } else if (params[name] === null) {
          prm.push(null);
        } else {
          prm.push(params[name]);
        }
      });
      return conn.real_query(script, prm, function (err, resultSet) {
        if (err) {
          var stacks = stackObj.stack.split('\n').slice(2).join('\n');
          err.stack = err.stack.split('\n')[0] + '\n' + stacks;
        }
        callback(err, resultSet);
      });
    } catch (e) {
      callback('not found script' + e);
    }
  };
  return conn;
}

exports = module.exports = function (anyDB) {
  return {
    createConnection: function (url, callback) {
      return wrapConnect(anyDB.createConnection(url, callback));
    },
    connect: function (url, callback) {
      return wrapConnect(anyDB.createConnection(url, callback));
    },
    createPool: function (url, prm) {
      var pool = anyDB.createPool(url, prm);
      return wrapConnect(pool);
    }
  };
};
module.exports.wrapConnect = wrapConnect;
