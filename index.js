var fs = require('fs');

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 8080);
// app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, resp) {
  resp.send('<h1>It works!</h1>');
});

app.get('/json', function(req, resp) {
  resp.json({
    message: 'hello world!',
    ok: true
  });
});

var GUESTBOOK_FILE = 'data/guestbook.json';
var guestbookData = [];
try {
  // if any of the steps fails then just disgard it
  guestbookData = JSON.parse(fs.readFileSync(GUESTBOOK_FILE, 'utf-8'));
} catch (e) {}

app.get('/form', function(req, resp) {
  // resp.sendFile(__dirname + '/templates/guestbook.html');
  resp.render('guestbook', {
    comments: guestbookData
  });
});

// middleware!
app.post('/form', function(req, resp, next) {
  var name = req.body.name;
  var msg = req.body.msg;
  // add record and save it
  if (!name || !msg) {
    resp.status(400).send('<h1 style="color: red;">AARRR: both fields are required!</h1>');
    resp.end();
    return;
  }

  guestbookData.push({
    name: name,
    content: msg
  });

  // no need to wait for writing
  fs.writeFile(GUESTBOOK_FILE, JSON.stringify(guestbookData), 'utf-8', function() {});
  resp.write('<h1>Your name is <kbd>' + name + '</kbd></h1>');
  resp.write('<h1>You typed <kbd>' + msg + '</kbd></h1>');
  next();
});

app.post('/form', function(req, resp, next) {
  request.post('http://www.md5online.org/md5-encrypt.html', {
    form: {
        md5: req.body.name,
        action: 'encrypt',
        a: 10869537
    }
  }, function(err, fresp) {
    var body = fresp.body;
    var matched = body.match(/is : <b>([0-9a-f]+)<\/b>/);
    if (matched) {
      resp.write(`<p>MD5 hash of your name is ${matched[1]}.</p>`);
    }
    next();
  });
});

app.post('/form', function(req, resp) {
  resp.write('<p>Have a nice day!</p>');
  resp.write('<a href="?">Go back</a>');
  resp.end();
});

// 404 is not regarded as an error
// it should be placed at last instead
app.use(function(req, resp, next) {
  resp.status(404).sendFile(__dirname + '/views/404.html');
});

app.listen(app.get('port'), function() {
    console.log('app listened on port ' + app.get('port') + '...');
});
