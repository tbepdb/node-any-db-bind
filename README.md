#any-db-bind

Wrapper for [any-db](https://github.com/grncdr/node-any-db). Allow use named bind variables in query.
## Description

The purpose of this library is to provide functionality of named bind variables for SQL database drivers [any-db](https://github.com/grncdr/node-any-db), while avoiding altering driver behaviour
as much as possible.

#Use bound parameters:
```javascript
var anyDB = require('any-db-bind')(require('any-db'));
var conn = anyDB.createConnection(...);
var sql = 'SELECT * FROM questions WHERE answer = :test'
conn.query(sql, {'test': 42}, function (err, res) {})
```

## License
MIT
