const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('reports', { "crumbs": [["reports", "Звітність"]], "title": "Звіти" });
  });

module.exports = router;

  