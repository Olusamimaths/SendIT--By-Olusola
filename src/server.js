import http from 'http';
import cors from 'cors';
import app from './app';


app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log(`Server started at port ${port}...`);
