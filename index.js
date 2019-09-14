const http      = require("http");
const hostname  = 'localhost';
const port      = 3000;
const express   = require('express');
const fs        = require('fs');
const app       = express();
const router    = express.Router();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/', express.static('./src/public', {etag: false}));

app.get('/', (req, res) => {
  app.use(express.static('./src/public/index.html', {etag: false}));
});

app.get('/feeds.html', (req, res) => {
  app.use(express.static('./src/public/feeds.html', {etag: false}));
});

app.listen(port, hostname, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

//Add feeds
app.post('/feed/add', (req, res) => {
  var test = { id:1 };
  res.setHeader('Content-Type', 'application/json');
 return res.send(JSON.stringify(test));
});

//Change feed status
app.post('/feed/change', (req, res) => {
  var test = { message:"ok" };
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(test));
});

//Feeds list
app.get('/feeds', (req, res) => {
  var test = [{id:42, url:"https://example.com"},{id:54, url:"https://example.com"},{id:44, url:"https://example.com"},{id:44, url:"https://example.com"}];
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(test));
});

//Fetch items
app.get('/fetch/:id', (req, res) => {
  var test = { message:"ok" };
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(test));
});

//Items list
app.get('/items', (req, res) => {
  var test = [{id:1, item:"item1"},{id:2, item:"item2"},{id:3, item:"item3"}];
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(test));
});

module.exports=router;