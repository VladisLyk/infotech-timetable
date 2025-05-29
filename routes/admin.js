const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware.authenticateToken);

const studentsRouter = require('./pages/students');
const teachersRouter = require('./pages/teachers');
const diciplinesRouter = require('./pages/diciplines');
const lessonsRouter = require('./pages/lessons');
const reportsRouter = require('./pages/reports');


router.get('/', (req, res) => {
  res.redirect('/admin/students');
});

router.get('/logout', (req, res) => {
  res.clearCookie("x-auth-token");
  res.redirect('/admin');
});

router.use('/students', studentsRouter);
router.use('/teachers', teachersRouter);
router.use('/reports', reportsRouter);
router.use('/diciplines', diciplinesRouter);
router.use('/lessons', lessonsRouter);

module.exports = router;
