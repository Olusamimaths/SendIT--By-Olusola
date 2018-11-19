'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var connectionString = 'postgres://postgres:solathecoder@localhost:5432/sendIT';

var client = new _pg.Client({
  connectionString: connectionString
});
client.connect();

exports.default = client;