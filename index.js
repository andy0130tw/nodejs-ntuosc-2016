var fs = require('fs');

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

// configure Express (not intended to be complete) ...
app.set('port', process.env.PORT || 8787);

app.get('/', function(req, resp) {
  resp.send('<h1>It works!</h1>');
});

// ... and start writing here!

app.listen(app.get('port'), function() {
    console.log(`app listened on port ${app.get('port')} ...`);
});
