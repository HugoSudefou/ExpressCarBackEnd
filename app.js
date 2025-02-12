var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var Store = require('connect-mongo')(session);
//var csrf = require('csurf');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

mongoose.connect('mongodb://localhost/bdd', function (err) {
    if (err) {
        throw err;
    }
});



app.use(session({
    store: new Store({mongooseConnection:mongoose.connection}),
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));


//app.use(lusca({
//    csrf: true,
//    csp: {/* ... */},
//    xframe: 'SAMEORIGIN',
//    p3p: 'ABCDEF',
//    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
//    xssProtection: true
//}));
//
/*app.use(csrf());
app.use(function (req, res, next) {
   res.locals.csrf = req.csrfToken();
   res.locals.session = req.session;
   next();
});*/


var routes = require('./app/routes/index');
var users = require('./app/routes/users');
var ad = require('./app/routes/ad');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ad', ad);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //res.render('404');
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = app;
