var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    data: {
      public: process.env.IMG_IO_PUBLIC_KEY,
      private: process.env.IMG_IO_PRIVATE_KEY
    }
  })
});

module.exports = router;
