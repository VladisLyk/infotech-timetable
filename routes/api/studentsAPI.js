const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const students = require('../../modules/students');

router.post('/prepared', (req, res) => {
    res.send(students.prepareHTML(req));
  });
router.post('/', (req, res) => {
    res.send(students.loadData(req));
});
router.post('/data', (req, res) => {
  res.send(students.data());
});

router.post('/remove', (req, res) => {
  students.remove(req)
  res.send({ reload: true });
});

router.post('/checkCourse', (req, res) => {
  res.send(students.checkAddedCourse(req));
});

router.post('/addcourse', (req, res) => {
  res.send(students.addCourse(req));
});

router.post('/editcourse', (req, res) => {
  res.send(students.editCourse(req));
});

router.post('/addgroup', (req, res) => {
  res.send(students.addGroup(req));
});

router.post('/courses', (req, res) => {
  res.send(students.prepareCoursesHTML(req.body.type));
});

module.exports = router;

  