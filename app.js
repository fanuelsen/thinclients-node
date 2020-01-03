'use strict';

require('dotenv').config()

var https = require('https');
var createError = require('http-errors');
var express = require('express');
var expressSession = require('express-session');
var mongoose = require('./database');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var MongoStore = require('connect-mongo')(expressSession);

var indexRouter = require('./routes/index');
var groupRouter = require('./routes/group');
var thinclientRouter = require('./routes/thinclient');
var thinstationHostsRouter = require('./routes/thinstation.hosts');

var passport = require('passport');
var config = require('./authenticationcfg');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

passport.serializeUser(function (user, done) {
  done(null, user.oid);
});

passport.deserializeUser(function (oid, done) {
  findByOid(oid, function (err, user) {
    done(err, user);
  });
});

var users = [];

var findByOid = function (oid, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    console.log('we are using user: ', user);
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

passport.use(new OIDCStrategy({
  identityMetadata: config.creds.identityMetadata,
  clientID: config.creds.clientID,
  responseType: config.creds.responseType,
  responseMode: config.creds.responseMode,
  redirectUrl: config.creds.redirectUrl,
  allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
  clientSecret: config.creds.clientSecret,
  validateIssuer: config.creds.validateIssuer,
  issuer: config.creds.issuer,
  passReqToCallback: config.creds.passReqToCallback,
  useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
  cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
  scope: config.creds.scope,
  loggingLevel: config.creds.loggingLevel,
  nonceLifetime: config.creds.nonceLifetime,
  nonceMaxAmount: config.creds.nonceMaxAmount,
  clockSkew: config.creds.clockSkew,
  },
  function (iss, sub, profile, accessToken, refreshToken, done) {
    if (!profile.oid) {
      return done(new Error("No oid found"), null);
    }
    process.nextTick(function () {
      findByOid(profile.oid, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
));

var app = express();

app.use(expressSession({
  secret: 'secret',
  cookie: { maxAge: config.mongoDBSessionMaxAge * 1000 },
  store: new MongoStore({
    mongooseConnection: mongoose.sessionStore,
    clear_interval: config.mongoDBSessionMaxAge
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');
hbs.registerHelper("select", function(value, options) {
  return options.fn(this)
    .split('\n')
    .map(function(v) {
      var t = 'value="' + value + '"'
      return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
    })
    .join('\n')
})

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'thinstation')));

app.use('/', indexRouter);
app.use('/group', groupRouter);
app.use('/thinclient', thinclientRouter);
app.use('/thinstation.hosts', thinstationHostsRouter);
app.use('/./thinstation.hosts', thinstationHostsRouter);

app.get('/login',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    res.redirect('/');
  });

app.post('/auth/openid/return',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    res.redirect('/');
  });

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    req.logOut();
    res.redirect(config.destroySessionUrl);
  });
});

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

module.exports = app;
