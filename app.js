require('dotenv').config();
const Server = require('./models/serve');

const server = new Server();
server.listen();


