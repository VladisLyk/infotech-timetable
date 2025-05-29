const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const lessonApi = require('../../modules/lessons');
const api = require("../../modules/reports");
router.post('/load', (req, res) => {
    res.send(api.makeReport(req.body.teacher));
});



module.exports = router;

  