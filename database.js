require('dotenv').config()
var mongoose = require('mongoose');
var config = require('./authenticationcfg');

mongoose.sessionStore = mongoose.createConnection(config.databaseUri);

mongoose.sessionStore.on('error', console.error.bind(console, 'connection error:'));
mongoose.sessionStore.once('open', function callback() {
    console.log("connected to sessionStore");
});

mongoose.db = mongoose.createConnection(process.env.MONGO_CONN_STRING, { useNewUrlParser: true });

mongoose.db.on('error', console.error.bind(console, 'connection error:'));
mongoose.db.once('open', function callback() {
    console.log("connected to db");
});

module.exports = mongoose;