/**
 *  Simple server with express
 *  github.com/aungcvt/simple-server
 */

var express = require('express');
var app = express();
var path = require('path');

app.use('/', express.static(__dirname+ '/app'));
app.use('/dist', express.static(__dirname+ '/dist'));
app.use('/bower_components', express.static(__dirname+ '/bower_components'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/*.html'));
});

var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('You website is running at http://%s:%s', host, port);
});