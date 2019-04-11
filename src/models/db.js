import { Client, Pool } from 'pg';
import { configuration } from '../config/config';

const connectionString = configuration(process.env.NODE_ENV).connectionString;

const pool = new Pool({ connectionString });
pool.on('connect', () => {
  console.log('connected to the db');
});


const createUserTable = `CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,  
  username varchar(50) NOT NULL, 
  firstname varchar(50) NOT NULL, 
  lastname varchar(50) NOT NULL,
   othernames varchar(50) NOT NULL, 
   email varchar(50) NOT NULL UNIQUE, 
   password varchar(100) NOT NULL, 
   isadmin BOOLEAN, 
   registered TIMESTAMP
   )`;

const createParcelTable = `CREATE TABLE parcels (id SERIAL PRIMARY KEY NOT NULL,  
  placedby integer REFERENCES users (id), 
  weight DOUBLE PRECISION NOT NULL, 
  weightMetric varchar(10) NOT NULL,  
  senton TIMESTAMP NOT NULL, 
  deliveredon TIMESTAMP NOT NULL,
  status varchar(10) NOT NULL,
  _from varchar NOT NULL,
  _to varchar NOT NULL,
  currentlocation varchar NOT NULL
  )`;


const runQuery = (query) => {
  pool.query(query)
    .then(() => console.log('Success in running table creation query.'))
    .catch(e => console.log(e));
};

// const insert_query = `INSERT INTO users(username, firstname, lastname, othernames, email, isAdmin, registered, password) 
//                                                 VALUES ('Sam', 'Olu', 'Tobi', 'Pelumi', 'solathecoder07m@lmail.com', 'false', '22-10-2018', 'solathecoder'), `;

// runQuery(`
// DROP TABLE IF EXISTS parcels;
// DROP TABLE IF EXISTS users;
// ${createUserTable};
// ${createParcelTable};
// ${insert_query}
// `)

pool.end()

const client = new Client({ connectionString });

client.connect()
  .then(() => console.log('Client is connected'))
  .catch((e) => console.log('Client could not connect', e));

  // client.end()
export default client;
