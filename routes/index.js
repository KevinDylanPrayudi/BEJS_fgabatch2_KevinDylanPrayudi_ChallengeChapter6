require('dotenv').config();
var express = require('express');
var router = express.Router();

const CONTROLLER = require('../controllers/posts.controllers');

const upload = require('../middlewares/upload.middleware');

router.get('/', CONTROLLER.gets);

router.post('/', upload.single('image'), CONTROLLER.post);

router.get('/:id', CONTROLLER.get);

router.put('/:id', upload.single('image'), CONTROLLER.put);

router.delete('/:id', CONTROLLER.delete);

router.get('/get-database', (req, res) => {
    res.send(process.env.DATABASE_URL)
})

module.exports = router;
