'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _config = require('../config/config');

var connectionString = (0, _config.configuration)(process.env.NODE_ENV).connectionString;

console.log(connectionString);

var pool = new _pg.Pool({ connectionString: connectionString });
pool.on('connect', function () {
  console.log('connected to the db');
});

var createUserTable = 'CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,  \n  username varchar(50) NOT NULL, \n  firstname varchar(50) NOT NULL, \n  lastname varchar(50) NOT NULL,\n   othernames varchar(50) NOT NULL, \n   email varchar(50) NOT NULL UNIQUE, \n   password varchar(100) NOT NULL, \n   isadmin BOOLEAN, \n   registered TIMESTAMP\n   )';

var createParcelTable = 'CREATE TABLE parcels (id SERIAL PRIMARY KEY NOT NULL,  \n  placedby integer REFERENCES users (id), \n  weight DOUBLE PRECISION NOT NULL, \n  weightMetric varchar(10) NOT NULL,  \n  senton TIMESTAMP NOT NULL, \n  deliveredon TIMESTAMP NOT NULL,\n  status varchar(10) NOT NULL,\n  _from varchar NOT NULL,\n  _to varchar NOT NULL,\n  currentlocation varchar NOT NULL\n  )';

var runQuery = function runQuery(query) {
  pool.query(query).then(function () {
    return console.log('Success in running table creation query.');
  }).catch(function (e) {
    return console.log(e);
  });
};

var insert_query = 'INSERT INTO users(username, firstname, lastname, othernames, email, isAdmin, registered, password) \n                                                VALUES (\'Sam\', \'Olu\', \'Tobi\', \'Pelumi\', \'solathecoder07m@lmail.com\', \'false\', \'22-10-2018\', \'solathecoder\'), ';

runQuery('\nDROP TABLE IF EXISTS parcels;\nDROP TABLE IF EXISTS users;\n' + createUserTable + ';\n' + createParcelTable + '\n');

pool.end();

var client = new _pg.Client({ connectionString: connectionString });

client.connect().then(function () {
  return console.log('Client is connected');
}).catch(function (e) {
  return console.log('Client could not connect', e);
});

// client.end()
exports.default = client;