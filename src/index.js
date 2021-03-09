const express = require('express');
const morgan = require('morgan');
const handlebars  = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const route = require('./routes');
const db = require('./config/db');

const {renderUser} = require('./app/middlewares/authenticateMiddleware');

// Connect to database
db.connect();

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'supersecrectstring',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 },
}))

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
})

app.use(renderUser);


app.engine('handlebars', handlebars({
  helpers: {
    showDotPassword: password => {
      const passwordArray = password.split('', 12);
      const dotPassword = passwordArray.map(value => '•');
      return dotPassword.join('');
    },
    displayTwoDecimalPlaces: price => {
      return price.toFixed(2);
    },
    replaceForwardSlash: name => {
      return name.replace(/\//g, '%2F');
    },
    centToDollar: cent => {
      return (cent / 100).toFixed(2);
    },
    for: (n, block) => {
      var accum = '';
      for(var i = 0; i < n; ++i)
        accum += block.fn(i + 1);
      return accum;
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources\\views'));



route(app);

app.listen(port, () => {
  console.log(`The shop is on at http://localhost:${port}`);
})