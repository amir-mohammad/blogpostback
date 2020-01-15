const express = require('express');
const bodyParser  = require('body-parser');
const connectDB = require('./config/db');

const app = express();
app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    next();
  
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

connectDB();
app.use('/users',require('./routes/User'));
app.use('/posts',require('./routes/Post'));


app.listen(2500,() => console.log("server is running on port 2500"));
