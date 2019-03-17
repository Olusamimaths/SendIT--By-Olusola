import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

const createUserTable = 
`CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,  
  username varchar(30) NOT NULL, 
  firstname varchar(30) NOT NULL, 
  lastname varchar(30) NOT NULL,
   othernames varchar(30) NOT NULL, 
   email varchar(30) NOT NULL UNIQUE, 
   password varchar(100) NOT NULL, 
   isadmin BOLEAN, 
   registered TIMESTAMP
   )`

   const createParcelTable = 
`CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,  
  placedby integer REFERENCES users (id), 
  weight DOUBLE PRECISION NOT NULL, 
  weightMetric varchar(10) NOT NULL,  
  senton TIMESTAMP NOT NULL, 
  deliveredon TIMESTAMP NOT NULL,
  status varchar(10) NOT NULL,
  _from varchar(30) NOT NULL,
  _to varchar(30) NOT NULL,
  currentlocation varchar(30) NOT NULL
  )`

const runQuery = (query) => {
  const client = new Client(connectionString);
  client.connect();
  client.query(query)
    .then(() => client.end())
    .catch(() => client.end())
};

runQuery(`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS parcels;
${createUserTable};
${createParcelTable}
`)



export default client;
