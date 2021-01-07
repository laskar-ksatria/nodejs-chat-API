const mongoose = require('mongoose');

function dbConnect() {  

const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = 'mongodb://localhost/chat-porto'

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true
});  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`We are connected to mongoDB`)
});

};

module.exports = dbConnect;