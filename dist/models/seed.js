'use strict';

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var insert_query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isAdmin, registered, password) \n                                VALUES (\'Sam\', \'Olu\', \'Tobi\', \'Pelumi\', \'solathecoder07m@lmail.com\', \'false\', \'NOW()\', \'solathecoder\'),\n                                (\'Sam\', \'Olu\', \'Tobi\', \'Pelumi\', \'newuser@lmail.com\', \'false\', \'NOW()\', \'solathecoder\') ';
_db2.default.query(insert_query, function (err, result) {
    console.log(err);
    console.log(result);
});