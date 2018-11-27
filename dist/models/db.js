'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var connectionString = process.env.DATABASE_URL;

var client = new _pg.Client({
  connectionString: connectionString
});
client.connect();

exports.default = client;