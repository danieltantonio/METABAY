(() => {
    const express = require('express');
    const session = require('express-session');
    const passport = require('passport');
    const MongoStore = require('connect-mongo')(session);

    const app = express();
    const connection = require('./config/db/mongoose');

    const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });
    
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 2
        }
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    module.exports = app;
})();