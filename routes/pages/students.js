const express = require('express');
const router = express.Router();
const students = require('../../modules/students');

router.get('/', (req, res) => {
    res.render('students', { "crumbs": [["students", "Студенти"]], "title": "Студенти" });
});

router.get('/add', (req, res) => {
    res.render('studentsAdd', { "crumbs": [["students", "Студенти"], ["students/add", "Додати"]], "title": "Додати студента" });
  });
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  var data = students.get(id);

  if(data == null) {
    res.redirect("/admin/students");
  } else {
    res.render('studentsEdit', { "id": id, "data": students.get(id), "crumbs": [["students", "Студенти"], ["students/edit", "Змінити"]], "title": "Редагувати студента" });
  }
});

module.exports = router;

  