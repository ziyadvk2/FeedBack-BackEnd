const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require("passport");
var bodyParser = require("body-parser")

require('./models/User');
require('./services/passport');

const app = express();
mongoose.set('strictQuery', true);
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true }) .then(() => console.log("MongoDB connected")) .catch((err) => console.log(err));

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
}))
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);



const PORT = process.env.PORT || 5000
app.listen(PORT);

