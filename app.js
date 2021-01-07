require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const Socket = require('socket.io');
const Io = Socket(server);
const PORT =  process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static('uploads'));

//mongoDB
require('./config/dbConnect')();

//mainRoute
app.use((req, res, next) => {
    req.Io = Io;
    next();
})
app.use(require('./routes'));
app.use(require('./middlewares/errHandler'));

server.listen(PORT, () => console.log(`Server started on ${PORT}`));

Io.on('connection', socket => {
    socket.on('diconnect', () => console.log('Socket-diconnect'));
})