'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var connectionString = process.env.DATABASE_URL;

console.log(connectionString);

var pool = new _pg.Pool({ connectionString: connectionString });
pool.on('connect', function () {
  console.log('connected to the db');
});

var createUserTable = 'CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,  \n  username varchar(50) NOT NULL, \n  firstname varchar(50) NOT NULL, \n  lastname varchar(50) NOT NULL,\n   othernames varchar(50) NOT NULL, \n   email varchar(50) NOT NULL UNIQUE, \n   password varchar(100) NOT NULL, \n   isadmin BOOLEAN, \n   registered TIMESTAMP\n   )';

var createParcelTable = 'CREATE TABLE parcels (id SERIAL PRIMARY KEY NOT NULL,  \n  placedby integer REFERENCES users (id), \n  weight DOUBLE PRECISION NOT NULL, \n  weightMetric varchar(10) NOT NULL,  \n  senton TIMESTAMP NOT NULL, \n  deliveredon TIMESTAMP NOT NULL,\n  status varchar(10) NOT NULL,\n  _from varchar NOT NULL,\n  _to varchar NOT NULL,\n  currentlocation varchar NOT NULL\n  )';

var runQuery = function runQuery(query) {
  pool.query(query).then(function () {
    return console.log("Success in running table creation query.");
  }).catch(function (e) {
    return console.log(e);
  });
};

runQuery('\nDROP TABLE IF EXISTS users;\nDROP TABLE IF EXISTS parcels;\n' + createUserTable + ';\n' + createParcelTable + '\n');

var client = new _pg.Client({ connectionString: connectionString });

client.connect().then(function () {
  return console.log("Client is connected");
}).catch(function () {
  return console.log("Client could not connect");
});

exports.default = client;