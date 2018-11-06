require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const { ensureLoggedIn } = require('connect-ensure-login');

mongoose
  .connect('mongodb://localhost/passport-role', { useNewUrlParser: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2) { throw new Error('Handlebars Helper ifUndefined needs 1 parameter'); }
  if (typeof value !== undefined) {
    return options.inverse(this);
  }
  return options.fn(this);
});


// default value for title local
app.locals.title = 'Express - Passport Security & Roles';


// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(flash());
require('./passport')(app);

// Middleware create in class
app.use((req, res, next) => {
  // if the user is connected, passport defined before a
  // req.user
  res.locals.isConnected = !!req.user;
  // !! converts truthy/falsy to true/false

  res.locals.isAdmin = req.user && req.user.role === 'ADMIN';

  next(); // to go to the next middleware
});


// function ensureAuthenticated(req, res, next) {
//   if (req.user) {
//     return next();
//   }
//   res.redirect('/auth/login');
// }

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/auth/login');
// }

// Routes definition
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/rooms'));

// Protects all routes from './routes/rooms
// app.use('/', ensureAuthenticated, require('./routes/rooms'));
// // Protects all routes from './routes/rooms'
// app.use('/', ensureLoggedIn('/auth/login'), require('./routes/rooms'));

module.exports = app;
