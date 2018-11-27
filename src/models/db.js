import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});
client.connect();


export default client;
