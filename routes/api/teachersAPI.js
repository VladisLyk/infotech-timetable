const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const teachers = require('../../modules/teachers');

router.post('/', (req, res) => {
    res.send(teachers.loadData(req));
});

router.post('/prepared', (req, res) => {
  res.send(teachers.prepareHTML(req));
});

router.post('/remove', (req, res) => {
  teachers.remove(req)
  res.send({ reload: true });
});

router.post('/add', (req, res) => {
  teachers.add(req)
  res.send({ reload: true });
});



module.exports = router;

  