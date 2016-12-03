import express from 'express';
import path from 'path';
import net from 'net';
import pug from 'pug';

const app = express();
app.set('view engine', 'pug')
app.set('views', './app/views')
app.use('/static', express.static('public'))

var SERVER_HOST = "localhost";
var SERVER_PORT = 12345;

var connection = net.connect(SERVER_PORT, SERVER_HOST, function() {
    console.log("Successfully connected to backend server!");   
});

app.get('/', function(req, res, next) {
  console.log('Request: [GET]', req.originalUrl);
  connection.write("0\r\n"); 

  connection.on('data', function(data) {
    console.log('Received docId =', data);
    
    res.redirect('editor/' + data); 
  });
});

app.get('/editor/:docId', function(req, res, next) {
  console.log('Request: [GET]', req.originalUrl);
  res.render('editor', {docId: req.params.docId}) 
});


const port = 8080;
app.listen(port);
console.log("Listening on port " + port);