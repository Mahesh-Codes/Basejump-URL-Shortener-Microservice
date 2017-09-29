'use strict';
// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var fs = require('fs');
var littleUrl = require('./db/schema.js')
//mongoosey
var user = (process.env.USER);
var pass = (process.env.PASS);
var dbUrl = "mongodb://" + user + ":" + pass + "@ds127864.mlab.com:27864/mahesh-fcc"; //mongodb://<dbuser>:<dbpassword>@ds127864.mlab.com:27864/mahesh-fcc
var db = mongoose.connect(dbUrl, {useMongoClient: true});

app.use(bodyParser.json());
app.use(cors());
//allow node to find public folder
app.use('/public', express.static(process.cwd() + '/public'));

// route to package.json file
app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

//** get URL to shorten *************************
app.get('/:name(*)', function(req, res, next) {
  var urlDataToShorten = (req.params.name);
  console.log("enter = ", urlDataToShorten);
  var regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (regexp.test(urlDataToShorten)) 
    {
      var shortUrlId = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
      var newUrl = new littleUrl({ original_url : urlDataToShorten, url_id : shortUrlId });
    newUrl.save(function(err) {
        if (err) return res.json({error: "There was error in saving to Database"}); 
         
    });
     return res.json({"Original_url": urlDataToShorten, "Short_url": shortUrlId}); // respose is new short url 
    } 
  //failed
 res.json({"Original_url": "Incorrect or Non Standard format" });
  
});


//get url_id form database and Redirect to URL
app.get('/:redirerctname', function(req, res, next) {
  var urlIdToRedirect = (req.params.redirerctname);
  console.log("redirect=", urlIdToRedirect);
   littleUrl.findOne({'url_id': urlIdToRedirect}, function(err, littleUrl) {
  if (err) return res.send('Short URL is not in Database');
   return res.redirect(301, littleUrl.original_url)   
});
 });



//listen to process.env.PORT which is glitch.com
app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});


