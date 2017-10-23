// Set up basic services like express
var express = require( 'express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = '';

// Get MongoDB connection from environmental or use local MongoDB instance
if(process.env.VCAP_SERVICES) {
    var vcap_services = process.env.VCAP_SERVICES;
    var mongodb_service = JSON.parse(vcap_services).mongodb[0];
    url = mongodb_service.credentials.uri;	
} else {
    url = 'mongodb://localhost:27017/item1';	
}

// Create express app to serve application
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use( express.static( __dirname + '/webapp'));
app.listen( process.env.PORT || 4000);

// Get mongodb client
var MongoClient = mongodb.MongoClient;
//Delete db
  //MongoClient.connect(url, function(err, db) {
  //  assert.equal(null, err);
  //  db.dropDatabase();
  //});
// Handler for /items GET
app.get("/items", function(req, res){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    // Get the collection
    var col = db.collection('items');
    col.find({}).toArray(function(err, docs) {
        res.send(docs);
        db.close();
      });
  });
});

// Handler for POST /item
app.post("/item", function(req, res){
  MongoClient.connect(url, function(err, db) {
    var col = db.collection('items');
    col.insertOne(req.body.item, function(err, r) {
      assert.equal(null, err);
      // Return full set of documents (for simplicity reasons)
      col.find().toArray(function(err, docs) {
          res.send(docs);
          db.close();
      });
    });
  });
});