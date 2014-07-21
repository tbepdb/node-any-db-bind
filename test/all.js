var path = require('path');
var util = require('util');
var extend = util._extend;

var log4js = require('log4js');

if (!process.env.LOG4JS_CONFIG) {
  log4js.configure(path.join(__dirname, 'log4js.json'), {});
}
log4js.setGlobalLogLevel("INFO");
//Error.stackTraceLimit = Infinity;


var lexer = require('./lexer');
var connect = require('./connect');

exports.lexer = lexer;
exports.connect = connect;
