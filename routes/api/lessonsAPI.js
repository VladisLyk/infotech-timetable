const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const api = require('../../modules/lessons');
const students = require('../../modules/students');
const { post } = require('./studentsAPI');

router.post('/', (req, res) => {
    res.send(api.loadData(req));
});
router.post('/prepared', (req, res) => {
    res.send(api.prepareHTML(req));
});
router.post('/buildEmpty', (req, res) => {
    res.send(api.buildEmpty(req.body.type));
});
router.post('/loadToday', (req, res) => {
    res.send(api.loadToday(req.body.type));
});
router.post('/checkToday', (req, res) => {
    res.send(api.today(req.body.type));
});
router.post('/checkFile', (req, res) => {
    res.send(api.checkFileForDate(req.body.date, req.body.type));
});
router.post('/checkStudents', (req, res) => {
    res.send(students.checkStudents(req.body.type));
});
router.post('/save', (req, res) => {
    res.send(api.save(req.body.data, req.body.type, req.body.date))
});
router.post('/replace', (req, res) => {
    res.send(api.replace(req.body.data, req.body.type, req.body.date))
});
router.post('/preview', (req, res) => {
    res.send(api.showTable(req.body.date, req.body.type))
});
router.get('/rebuild', (req, res) => {
    api.buildTableHTML("table_2023-12-19_phys.html", api.open("table_2023-12-19_phys.json"), "phys");
    res.send(202);
});
router.post("/generateAdmin", (req, res) => {
    res.send(api.generateEditTable(req.body.file));
});

module.exports = router;

  