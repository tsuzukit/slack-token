const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const route = require('./routes/index');

app.set('view engine', 'ejs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname + '/public'));
app.use('/', route);

const server = app.listen(3000, async () => {
  console.log('Example app listening on port 3000!')
});

module.exports = app;