import { Client } from 'pg';
const connectionString = 'postgres://postgres:solathecoder@localhost:5432/sendIT';

const client = new Client({
  connectionString,
});
client.connect();


export default client;
