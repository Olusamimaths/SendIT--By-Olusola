import { Client, Pool } from 'pg';
import dotenv from 'dotenv'
dotenv.config()



const connectionString = process.env.DATABASE_URL;

console.log(connectionString)

const pool = new Pool({ connectionString });
pool.on('connect', () => {
  console.log('connected to the db');
});

const createUserTable = 
`CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,  
  username varchar(30) NOT NULL, 
  firstname varchar(30) NOT NULL, 
  lastname varchar(30) NOT NULL,
   othernames varchar(30) NOT NULL, 
   email varchar(30) NOT NULL UNIQUE, 
   password varchar(100) NOT NULL, 
   isadmin BOOLEAN, 
   registered TIMESTAMP
   )`

   const createParcelTable = 
`CREATE TABLE parcels (id SERIAL PRIMARY KEY NOT NULL,  
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
  pool.query(query)
  .then(() => console.log("Success"))
  .catch(e => console.log(e))
};

// runQuery(`
// DROP TABLE IF EXISTS users;
// DROP TABLE IF EXISTS parcels;
// ${createUserTable};
// ${createParcelTable}
// `)

const client = new Client({connectionString})

client.connect()
  .then(() => console.log("Client is connected"))
  .catch(() => console.log("Client could not connect"))

  export default client;