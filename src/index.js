const express = require('express');
const morgan = require('morgan');
const handlebars  = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();
const port = process.env.PORT;

const route = require('./routes');
const db = require('./config/db');

const {renderUser} = require('./app/middlewares/authenticateMiddleware')

// Connect to database
db.connect();

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(renderUser);


app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources\\views'));



route(app);

app.listen(port, () => {
  console.log(`The shop is on at http://localhost:${port}`);
})