const express = require('express');
const router = express.Router();

const APIpublicRouter = require("./api/publicAPI");
router.use("/public", APIpublicRouter);

const apiMiddleware = require('../middlewares/apiMiddleware');
router.use(apiMiddleware.apiAuth);

const APIstudentsRouter = require('./api/studentsAPI');
const APIteachersRouter = require('./api/teachersAPI');
const APIdicipRouter = require('./api/diciplinesAPI');
const APIlessonsRouter = require("./api/lessonsAPI");
const APIreportsRouter = require("./api/reportsAPI");

router.use('/students', APIstudentsRouter);
router.use('/teachers', APIteachersRouter);
router.use('/diciplines', APIdicipRouter);
router.use("/lessons", APIlessonsRouter);
router.use("/reports", APIreportsRouter);

module.exports = router;
