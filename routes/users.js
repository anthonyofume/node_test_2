var express = require('express');
var router = express.Router();
const request = require('supertest');
const app = require('../app');

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





/**
 * TESTING TO GET ALL USERS ENDPOINT
 */
describe('GET /users', function () {
  it('respond with json containing a list of all users', function (done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

/**
 * Testing get a user endpoint by giving an existing user
 */
describe('GET /user/:id', function () {
  it('respond with json containing a single user', function (done) {
    request(app)
      .get('/users/U001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

/**
* Testing get a user endpoint by giving a non-existing user
*/
describe('GET /user/:id', function () {
  it('respond with json user not found', function (done) {
    request(app)
      .get('/users/idisnonexisting')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404) //expecting HTTP status code
      .expect('"user not found"') // expecting content value
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

/**
* Testing post user endpoint
*/
describe('POST /users', function () {
  let data = {
    "id": "1",
    "name": "dummy",
    "contact": "dummy",
    "address": "dummy"
  }
  it('respond with 201 created', function (done) {
    request(app)
      .post('/users')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

/**
* Testing post user endpoint
*/
describe('POST /users', function () {
  let data = {
    //no id
    "name": "dummy",
    "contact": "dummy",
    "address": "dummy"
  }
  it('respond with 400 not created', function (done) {
    request(app)
      .post('/users')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect('"user not created"')
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});



module.exports = router;
