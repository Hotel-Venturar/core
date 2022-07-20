var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var http = require('http');
var socket = require('socket.io');
var bodyParser = require('body-parser');

var app = express();
var http = http.Server(app);
var io = socket(http);

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  legacyMode: true
});

redisClient.connect();

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'password',
  resave: true,
  saveUninitialized: true,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      maxAge: 2000 * 60 * 10 // session max age in miliseconds
  }
}));
/* app.use(function(req, res, next){
 
  let contentType = req.headers["content-type"];
 
  if (req.method === 'POST' && contentType.indexOf('multipart/form-data;') > -1) {
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true
    });
 
    form.parse(req, function(err, fields, files){
 
      req.fields = fields;
      req.files = files;
 
      next();
 
    });
  } else {
    next();
  }
 
});
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function (socket) {

  console.log('a user connected');

  socket.on('disconnect', function () {

    console.log('user disconnected');

  });

});

http.listen(3000, ()=>{

  console.log('Servidor em execução...');

});