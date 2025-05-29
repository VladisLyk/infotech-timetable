const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

const port = 80;

app.use(cookieParser('secret'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const publicRouter = require('./routes/public');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/pages/auth');

app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.use('/', publicRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

const reportSystem = require('./cron/report');
reportSystem.start();

var ip = "localhost"; 

app.listen(port, ip, () => {
  console.log(`Server is running at http://${ip}:${port}`);
});

