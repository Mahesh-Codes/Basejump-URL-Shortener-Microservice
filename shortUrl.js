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
mongoose.Promise = global.Promise;
var dbUrl = "mongodb://" + user + ":" + pass + "@ds127864.mlab.com:27864/mahesh-fcc"; //mongodb://<dbuser>:<dbpassword>@ds127864.mlab.com:27864/mahesh-fcc
var db = mongoose.connect(dbUrl, {
    useMongoClient: true
});

app.use(bodyParser.json());
app.use(cors());
//allow node to find public folder
app.use('/public', express.static(process.cwd() + '/public'));

// route to package.json file
app.route('/_api/package.json')
    .get(function(req, res, next) {
        console.log('requested');
        fs.readFile(__dirname + '/package.json', function(err, data) {
            if (err) return next(err);
            res.type('txt').send(data.toString());
        });
    });


app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    })

/*** Get Request *****************/
app.get('/:name(*)', function(req, res, next) {
    var urlDataToShorten = req.params.name;

    //is rquested url in database
    littleUrl.findOne({
        original_url: urlDataToShorten
    }, function(err, shortUrl) {
        if (err) {
          console.error(err);
          next(err);
          return;
        }
        if  (shortUrl) {
          res.json({"Original_url": urlDataToShorten, "shortUrl": shortUrl.url_id}); // Found URL. response short url from DB
          return;
        }

        // Not Found
        littleUrl.findOne({
            url_id: urlDataToShorten
        }, function(err, shortUrl) {
            if (err) {
              console.error(err);
              next(err);
              return;
            }
            if (shortUrl) {
              res.redirect(301, shortUrl.original_url); // Found URL. Redirect to url from DB
              return;
            }

            // Not Found
            var regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            var testUrl = regexp.test(urlDataToShorten);
            if (testUrl === true) {
                console.log("passed regex = ", testUrl);
                var shortUrlId = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
                var newUrl = new littleUrl({
                    original_url: urlDataToShorten,
                    url_id: shortUrlId
                });
                console.log(newUrl.original_url)
                console.log("to save = ", newUrl.original_url, newUrl.url_id)
                //if URL save
                newUrl.save(function(err) {
                    if (err) {
                        console.log("passed error trap in save = ", urlDataToShorten);
                        next(err);
                        return;
                    }
                    console.log("saved and returned = ", littleUrl.url_id);
                    res.status(401).json({"Original_url": urlDataToShorten, "shortUrl": shortUrlId}); // saved URL. response short url from DB
                    return;
                });
                return;
            }
            res.status(500).json({
                "Original URL": "There was Error in entering URL"
            })
        });
    });
   // next();
});

  /*** Get Request *****************
app.get('/:name(*)', function(req, res, next) {
    var urlDataToShorten = (req.params.name);

    //is rquested url in database
    littleUrl.findOne({
        original_url: urlDataToShorten
    }, function(err, littleUrl) {
        if (err) next(); //console.error("err");
        if (littleUrl == null) next();
        console.log("find=", littleUrl)
       if  (littleUrl !== null) return res.json({"Original_url": urlDataToShorten, "shortUrl": littleUrl.url_id}); // Found URL. response short url from DB  
    });
   // next();
});

//is requested Short_url in database
app.get('/:name(*)', function(req, res, next) {
    var urlDataToShorten = (req.params.name);
    littleUrl.findOne({
        url_id: urlDataToShorten
    }, function(err, littleUrl) {
        if (err) console.error("err");
        if (littleUrl == null) next();
        if (littleUrl) return res.redirect(301, littleUrl.original_url); // Found URL. Redirect to url from DB 
    });
   // next();
});

//is it URL
app.get('/:name(*)', function(req, res, next) {
    var urlDataToShorten = (req.params.name);
    var regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    var testUrl = regexp.test(urlDataToShorten);
    if (testUrl === true) {
        console.log("passed regex = ", testUrl);
        var shortUrlId = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
        var newUrl = new littleUrl({
            original_url: urlDataToShorten,
            url_id: shortUrlId
        });
console.log(newUrl.original_url)
        //if URL save
        newUrl.save(function(err) {
            if (err) {
                console.log("passed error trap in save = ", urlDataToShorten);
                next();
            }
            console.log("saved and returned = ", littleUrl.url_id);

        });
console.log("to save = ", newUrl.original_url, newUrl.url_id)
        return res.status(401).json({"Original_url": urlDataToShorten, "shortUrl": shortUrlId}); // saved URL. response short url from DB
       
    }

    next();

});
//  must be error in URL entry
app.get('/:name(*)', function(req, res, next) {
    res.send({
        "Original URL": "There was Error in entering URL"
    })
});
*******/
//listen to process.env.PORT which is glitch.com
app.listen(process.env.PORT, function() {
    console.log('Node.js listening ...');
});