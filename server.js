var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.use(require('connect-livereload')({port: 35729}));

app.get('/foo', function(req, res) {
  res.send('ok');
});

var port = 8080;
app.listen(port, '0.0.0.0');
console.log('server listening on port %d', port);
