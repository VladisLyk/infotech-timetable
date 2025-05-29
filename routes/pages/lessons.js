const express = require('express');
const router = express.Router();
const lessons = require("../../modules/lessons");
const students = require("../../modules/students");

router.get('/', (req, res) => {
  res.render('lessons', { "createdToday": lessons.today("phys"), "crumbs": [["lessons", "Розклад занять"]], "title": "Заняття" });
});

router.get('/edit/:date/:type', (req, res) => {
  const file = `table_${req.params.date}_${req.params.type}.json`;
  if (lessons.checkFile(file)) {
    res.render('lessonsEdit', { "file": file, "date":req.params.date, "type": req.params.type, "crumbs": [["lessons", "Розклад занять"], ["lessons/edit", "Змінити"]], "title": "Змінити розклад" });
  } else {
    res.redirect("/admin/lessons");
  }
});

router.get('/add', (req, res) => {
  const date = req.query.date;
  const type = req.query.type;

  const currentDate = new Date();
  const selectedDate = new Date(date);

  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if ((type === "phys" || type === "math") && (selectedDate >= currentDate) && !lessons.checkFileForDate(date, type) && students.checkStudents(type)) {
    res.render('lessonsAdd', { date, type, "crumbs": [["lessons", "Розклад занять"], ["lessons/add", "Додати"]], "title": "Додати розклад" });
  } else {
    res.redirect("/admin/lessons");
  }
});





module.exports = router;

  