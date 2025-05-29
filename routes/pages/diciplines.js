const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('diciplines', { "crumbs": [["diciplines", "Дисципліни"]], "title": "Дисципліни" });
});

router.get('/add', (req, res) => {
  res.render('diciplinesAdd', { "crumbs": [["diciplines", "Дисципліни"], ["diciplines/add", "Додати"]], "title": "Додати дисципліну" });
});

module.exports = router;

  