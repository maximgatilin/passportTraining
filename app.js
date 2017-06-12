const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');

// Init app
const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
// todo understand session params
app.use(session({
  secret: 'secret',
  saveUninitialized : true,
  resave: true
}));

// Passport init
// todo understand how passport works
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
// todo understand how errorFormatter works
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    debugger;
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while(namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users/', users);

// Set port and start server
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`)
});















