const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { isArray } = require("util");

const app = express();

const twoDay = 1000 * 60 * 60 * 48;
console.log(twoDay);

app.use(sessions({
  secret: "spak5u9rbRWBkWTSmu9kspak",
  saveUninitialized: true,
  cookie: { maxAge: twoDay },
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());

const frontEndRoutes = require('./routes/frontEnd');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');

app.use(express.static(path.join(__dirname, "public")));

app.use(frontEndRoutes);
app.use(adminRoutes);
app.use(managerRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.clear();
  console.log("Application listening on port 2000!");
});