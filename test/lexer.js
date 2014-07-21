var lexer = require('../lib/lexer');
var log = require('log4js').getLogger('test lexer');

exports.setUp =  function (callback) {
  callback();
};
exports.tearDown = function (callback) {
  callback();
};


exports.testSimple = function(test){
  var tokens = lexer.tokenize('select * from dual');
  test.equal('SELECT', tokens.shift()[0], "unexpected token");
  test.equal('STAR', tokens.shift()[0], "unexpected token");
  test.equal('FROM', tokens.shift()[0], "unexpected token");
  test.equal('LITERAL', tokens.shift()[0], "unexpected token");
  test.equal('EOF', tokens.shift()[0], "unexpected token");
  test.done();
};


exports.testSimpleVar = function(test){
  var tokens = lexer.tokenize('select :test from dual');
  log.debug(tokens); 
  test.equal('SELECT', tokens.shift()[0], "unexpected token");
  test.equal('VAR', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('FROM', tokens.shift()[0], "unexpected token");
  test.equal('LITERAL', tokens.shift()[0], "unexpected token");
  test.equal('EOF', tokens.shift()[0], "unexpected token");
  test.done();
};

exports.testSecondVar = function(test){
  var tokens = lexer.tokenize('select :test from dual where :test=true');
  log.debug(tokens); 
  test.equal('SELECT', tokens.shift()[0], "unexpected token");
  test.equal('VAR', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('FROM', tokens.shift()[0], "unexpected token");
  test.equal('LITERAL', tokens.shift()[0], "unexpected token");
  test.equal('WHERE', tokens.shift()[0], "unexpected token");
  test.equal('VAR', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('OPERATOR', tokens.shift()[0], "unexpected token");
  test.equal('BOOLEAN', tokens.shift()[0], "unexpected token");
  test.equal('EOF', tokens.shift()[0], "unexpected token");
  test.done();
};


exports.testVarInString = function(test){
  var tokens = lexer.tokenize('select \':test\' from dual where :test=true');
  log.debug(tokens); 
  test.equal('SELECT', tokens.shift()[0], "unexpected token");
  test.equal('STRING', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('FROM', tokens.shift()[0], "unexpected token");
  test.equal('LITERAL', tokens.shift()[0], "unexpected token");
  test.equal('WHERE', tokens.shift()[0], "unexpected token");
  test.equal('VAR', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('OPERATOR', tokens.shift()[0], "unexpected token");
  test.equal('BOOLEAN', tokens.shift()[0], "unexpected token");
  test.equal('EOF', tokens.shift()[0], "unexpected token");
  test.done();
};
exports.testVarInName = function(test){
  var tokens = lexer.tokenize('select \":test\" from dual where :test=true');
  log.debug(tokens); 
  test.equal('SELECT', tokens.shift()[0], "unexpected token");
  test.equal('DBLSTRING', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('FROM', tokens.shift()[0], "unexpected token");
  test.equal('LITERAL', tokens.shift()[0], "unexpected token");
  test.equal('WHERE', tokens.shift()[0], "unexpected token");
  test.equal('VAR', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('OPERATOR', tokens.shift()[0], "unexpected token");
  test.equal('BOOLEAN', tokens.shift()[0], "unexpected token");
  test.equal('EOF', tokens.shift()[0], "unexpected token");
  test.done();
};

exports.testNewLine = function(test){
  var tokens = lexer.tokenize('select \':test\' \n from dual where :test=true');
  log.debug(tokens); 
  test.equal('SELECT', tokens.shift()[0], "unexpected token");
  test.equal('STRING', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('FROM', tokens.shift()[0], "unexpected token");
  test.equal('LITERAL', tokens.shift()[0], "unexpected token");
  test.equal('WHERE', tokens.shift()[0], "unexpected token");
  test.equal('VAR', tokens[0][0], "unexpected token");
  test.equal(':test', tokens.shift()[1], "unexpected token");
  test.equal('OPERATOR', tokens.shift()[0], "unexpected token");
  test.equal('BOOLEAN', tokens.shift()[0], "unexpected token");
  test.equal('EOF', tokens.shift()[0], "unexpected token");
  test.done();
};

exports.testInvalidExpression = function(test){
  var has_catch = false;
  try {
    var tokens = lexer.tokenize('select \':test \n from dual where :test=true');
  } catch(e) {
    has_catch = true;
  }
  test.ok(has_catch, "unexpected valid sql");
  test.done();
};
