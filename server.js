var express = require("express");
var auth = require('./auth');
var router = require('./router');
var bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use('/key', router);
app.use('/protected', auth.isAuthenticated);

app.get("/protected/test", (req, res)=>{
  res.send("nice it worked!");
});

app.listen(3000, () => console.log('listening on 3000'));
