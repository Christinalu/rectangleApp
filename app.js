var createError = require('http-errors');
var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = process.env.PORT || 3000;
const http = require('http').Server(app);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@rectanglecluster.srvm6.mongodb.net/rectangles?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err, database) => {
  //const collection = client.db("rectangles").collection("rectangle");
  // perform actions on the collection object
  if(err){
    console.log(`MONGODB CONNECTION ERROR: ${err}:${err.stack}`)
    process.exit(1)
  }
  app.locals.db = database.db('rectangles')
  http.listen(port, () => {
    console.log("Listening on port " + port)
    app.emit('App started')
  })
  //client.close();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.use('/rectangle', indexRouter);
app.use('/', usersRouter);

module.exports = app;
