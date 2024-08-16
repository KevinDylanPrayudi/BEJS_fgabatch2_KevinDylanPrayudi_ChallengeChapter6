const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const model = require('../models/login.model');
const validator = require('../validators/login.validator');

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, user);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const result = await model.login({ username });
        if (result) {
            const match = await bcrypt.compare(password, result.password);
            if (match) {
                return done(null, result.id);
            }
        }

        return done(null, false, { message: 'Incorrect username or password.' });
    } catch (error) {
        return done(error);
    }
}));

function authentication(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        const { error } = validator.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.details[0].message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: info.message
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                status: 'success',
                message: 'Success login'
            });
        });
    })(req, res, next);
}

module.exports = {
    authentication,
    passport
};