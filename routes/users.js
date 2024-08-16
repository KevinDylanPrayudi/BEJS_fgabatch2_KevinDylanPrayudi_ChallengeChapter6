const express = require('express');
const router = express.Router();

const CONTROLLER = require('../controllers/users.controller');
const MIDDLEWARE = require('../middlewares/local.middleware').passport;

router.get('/', CONTROLLER.gets);
router.post('/', CONTROLLER.post);

router.use(MIDDLEWARE.authenticate('session'), function (req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized'
        })
    }
    next();
});
router.get('/me', CONTROLLER.get);
router.put('/', CONTROLLER.put);
router.delete('/', CONTROLLER.delete);

module.exports = router;