const express = require('express');

const nodemailerController = require('../Controller/nodemailerController');


const router = express.Router();

router.post('/sendMails', nodemailerController.sendMails );

module.exports = router;