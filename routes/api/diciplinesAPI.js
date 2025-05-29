const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const api = require('../../modules/diciplines');

router.post('/', (req, res) => {
    res.send(api.loadData(req));
});

router.post('/prepared', (req, res) => {
  res.send(api.prepareHTML(req));
});

router.post('/remove', (req, res) => {
  api.remove(req)
  res.send({ reload: true });
});

router.post('/find', (req, res) => {
  res.send(api.findSimilar(req))
});

router.post('/add', (req, res) => {
  res.send(api.add(req));
});



module.exports = router;

  