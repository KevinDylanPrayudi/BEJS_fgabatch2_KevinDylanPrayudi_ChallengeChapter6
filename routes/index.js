require('dotenv').config();
var express = require('express');
var router = express.Router();

const CONTROLLER = require('../controllers/posts.controllers');

const upload = require('../middlewares/upload.middleware');
const MIDDLEWARE = require('../middlewares/local.middleware').passport;

router.get('/', CONTROLLER.gets);

router.use(MIDDLEWARE.authenticate('session'), function (req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized'
        })
    }
    next();
});

router.post('/', upload.single('image'), CONTROLLER.post);

router.get('/:id', CONTROLLER.get);

router.put('/:id', upload.single('image'), CONTROLLER.put);

router.delete('/:id', CONTROLLER.delete);

module.exports = router;
