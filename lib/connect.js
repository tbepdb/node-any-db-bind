/*jslint node: true */
"use strict";
var anyDB = require('any-db');
var log4js = require('log4js');
var log = log4js.getLogger('db connect');
var lexer = require('./lexer');

function wrapConnect(conn) {
  conn.real_query = conn.query;
  conn.query = function (text, params, callback) {
    if (typeof params == 'function') {
      callback = params;
      params = {};
    }
    try {
      log.debug(text);
      var tokens = lexer.tokenize(text);
      log.debug('prepare script ' + text);
      var s = text, i = 0, p = [];
      tokens.forEach(function (token) {
        if (token[0] === 'VAR') {
          i = i + 1;
          if (conn.adapter.name == 'postgres') {
            s = s.replace(token[1], '$' + i);
          } else {
            s = s.replace(token[1], '?');
          } 
          p.push(token[1].substr(1,token[1].length));
        }
      });
      var prm = [];
      p.forEach(function (col) {
        prm.push(params[col] == undefined ? null : params[col]);
      });
      log.debug('query', s, prm);
      return conn.real_query(s, prm, callback);
    } catch (e) {
      log.warn('not found script', e);
      throw new Error('unknown query');
    }
  };
  return conn;
}

exports.connect = function(url) {
  return wrapConnect(anyDB.createConnection(url));
};

exports.createPool = function(url, prm) {
  return wrapConnect(anyDB.createPool(url, prm));
};