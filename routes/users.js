var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/contact_db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
let Schema = mongoose.Schema;

let contactModelSchema = new Schema({
  name: String,
  phone: String,
  email: String
});

//create model
let contactModel = mongoose.model('contactModel', contactModelSchema);

//creating schema field types
let contact = new Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  updated: {
    type: Date, default: Date.now
  }
});



router.post('/', function (req, res, next) {
  let addContact = new contactModel({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  });
  addContact.save(function (err, result) {
    if (err) return handleError(err);
    res.status(200).send(result);
  })
});



router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  contactModel.findById(id, (function (err, result) {
    if (err) throw err;
    res.send(result);
  }));
});


router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  contactModel.findOneAndUpdate({ _id: id }, req.body, { new: true }, function (err, result) {
    if (err)
      res.send(err);
    res.send('Contact Updated');
  });
});


router.delete('/', function (req, res, next) {
  contactModel.remove({ _id: req.body.id }, function (err, result) {
    if (err)
      res.send(err);
    res.send('Contact deleted');
  });
});




/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
