'use strict';
/*jslint unparam: true, indent:2, nomen: true, plusplus: true, vars: true */
var lexer = require('./lexer');

exports = module.exports = function (anyDB) {

  function wrapConnect(conn) {
    conn.real_query = conn.query;
    conn.query = function (text, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      try {
        var tokens = lexer.tokenize(text);
        var s = text, i = 0, p = [];
        tokens.forEach(function (token) {
          if (token[0] === 'VAR') {
            i = i + 1;
            if (conn.adapter.name === 'postgres') {
              s = s.replace(token[1], '$' + i);
            } else {
              s = s.replace(token[1], '?');
            }
            p.push(token[1].substr(1, token[1].length));
          }
        });
        var prm = [];
        p.forEach(function (col) {
          if (params[col] === undefined) {
            prm.push(null);
          } else if (params[col] === null) {
            prm.push(null);
          } else {
            prm.push(params[col]);
          }
        });
        return conn.real_query(s, prm, callback);
      } catch (e) {
        callback('not found script' + e);
      }
    };
    return conn;
  }

  return {
    createConnection: function (url) {
      return wrapConnect(anyDB.createConnection(url));
    },
    connect: function (url) {
      return wrapConnect(anyDB.createConnection(url));
    },
    createPool: function (url, prm) {
      return wrapConnect(anyDB.createPool(url, prm));
    }
  };
};