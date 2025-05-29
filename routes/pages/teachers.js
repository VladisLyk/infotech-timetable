const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('teachers', { "crumbs": [["teachers", "Викладачі"]], "title": "Викладачі" });
});

module.exports = router;

  