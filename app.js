const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser')

const app = express();

let client;
// Passport Config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

// Connect to database
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


// EJS
app.use(expressLayouts); // acts kind of like partials
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.use(express.static('public'))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
