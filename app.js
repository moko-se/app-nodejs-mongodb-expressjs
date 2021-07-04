/* Appel aux modules nécessaires*/
const createError = require('http-errors'); 
const express = require('express');
const path = require('path');
const passport = require('passport');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
require('./config/db');

/* Création de l'application de type express */
const app = express();

//config passport
require('./config/passport')(passport);

//use serve-favicon
app.use(favicon(path.join(__dirname, 'public', 'logo_sans_text.ico')));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', './layouts/admin_layout');
app.set('layout', './layouts/index_layout');
app.set('layout', './layouts/account_layout');
app.set('view engine', 'ejs');

/* Definition des Middlewares */

//setup express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//config session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
//setup bodyParser

//methode override 
app.use(methodOverride('_method'));
//setup passport
app.use(passport.initialize());
app.use(passport.session());
//setup connect-flash
app.use(flash());

/* Global variables */
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null ;
  next();
});

/* Définition des gestionnaires de routages */
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);

/* Capture de l'erreur 404 */
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('errorHandler', {title: 'Error page', layout: './layouts/account_layout'});
});

/*Lancement de l'application sur lme port 3000 */
app.listen(process.env.PORT || 3000, (err)=>{
	if (err) throw err;
	console.log(`success connection in port 3000`);
});