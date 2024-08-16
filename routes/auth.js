const express = require('express');
const router = express.Router();
const MIDDLEWARE = require('../middlewares/local.middleware');

router.post('/', MIDDLEWARE.authentication);

router.use(MIDDLEWARE.passport.authenticate('session'), function (req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized'
        })
    }
    next();
});

router.delete('/', MIDDLEWARE.passport.authenticate('session'), function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
    });

    res.status(200).end();
});

module.exports = router;