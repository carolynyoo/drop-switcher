var path = require('path');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
// var favicon = require('serve-favicon');
var app = express();
module.exports = app;

var publicPath = path.join(__dirname, '/public');
var indexHtmlPath = path.join(__dirname, '/views/index.html');
var bowerPath = path.join(__dirname, '/bower_components');

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/bower_components', express.static(bowerPath));
app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/cards', function (req, res) {

//     var modelParams = req.query.category ? { category: req.query.category } : {};

//     FlashCardModel.find(modelParams, function (err, cards) {
//         setTimeout(function () {
//             res.send(cards);
//         }, Math.random() * 100);
//     });

// });

app.post('/analyze', function (req, res, next) {
  console.log(req.body.url);
  var url = req.body.url; 

  request('http://fast-river-6374.herokuapp.com/?url='+url, function (err, response, body) {
    if (err) {
      return next(err);
    }
    res.json(body);
  })
});

app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});
