var anyDB = require('../lib/wrapper')(require('any-db'));
var log = require('log4js').getLogger('test connect');
var conn;

exports.setUp =  function (callback) {
  conn = anyDB.createPool('postgres://postgres@localhost:5432/postgres');
  callback();
};

exports.tearDown = function (callback) {
  conn.close();
  callback();
};


exports.testSimple = function(test) {
  conn.query('select 1 dummy', function(err, data) {
    test.equal('1', data.rows[0].dummy);
    test.done();
  });
};

exports.testSimple2 = function(test) {
  conn.query('select cast(:test as varchar) col', {'test': 'passed'}, function(err, data) {
    test.equal('passed', data.rows[0].col);
    test.done();
  });
};

exports.testSimple3 = function(test) {
  conn.query('select 1 col from (select 1) t where :test=\'passed\'', {'test': 'passed'}, function(err, data) {
    test.equal('1', data.rows[0].col);
    test.done();
  });
};

exports.testSimple4 = function(test) {
  var q = conn.query('select 1 col from (select 1) t where :test=\'passed\'', {'test': 'passed'});
  q.on('error', function(err) {
    log.warn(err);
  });
  q.on('data', function(row) {
    test.equal('1', row.col);
  });
  q.on('end', function() {
    test.done();
  });
};