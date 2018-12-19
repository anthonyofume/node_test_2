var express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const salt = require('salt')
var router = express.Router();
mongoose.connect('mongodb://127.0.0.1:27017/contact_db');


const saltRounds = 10;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let Schema = mongoose.Schema;

let userModelSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  password: String
});

//create model
let userModel = mongoose.model('userModel', userModelSchema);


router.post('/register', function (req, res, next) {
  let password = req.body.password;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  let createUsers = new userModel({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hash
  });
  createUsers.save(function (err, result) {
    if (err) return handleError(err);
    res.status(200).send(result);
  });
});

router.post('/login', function (req, res, next) {
  let email = req.body.email;
  var secret = req.headers.secret;
  var payload = {
    email: req.body.email,
    "status": "SUCCESS"

  };
  userModel.find({ email: email }, (function (err, result) {
    let password = req.body.password;
    if (result == false) {
      res.send('User does not exist!');
    } else {
      password = bcrypt.compareSync(req.body.password, result[0].password);
      if (password) {
        res.send(result);
      } else {
        res.send('Wrong Password');
      }

    }
  }));
});

module.exports = router;
