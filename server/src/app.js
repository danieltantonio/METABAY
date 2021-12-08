(() => {
    const express = require('express');
    const session = require('express-session');
    const passport = require('passport');
    const MongoStore = require('connect-mongo')(session);
    const cors = require('cors');
    const fs = require('fs');

    const app = express();
    const connection = require('./config/db/mongoose');

    const orderRouter = require('./api/orderRouter');
    const itemRouter = require('./api/itemRouter');

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
    app.use(cors());
    app.use('/static', express.static(__dirname + '/static'));

    app.use('/order', orderRouter);
    app.use('/item', itemRouter);
    
    module.exports = app;
})();