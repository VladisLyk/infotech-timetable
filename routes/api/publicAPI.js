const express = require('express');
const bodyParser = require('body-parser');

const fs = require("fs");
const path = require('path');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const api = require('../../modules/lessons');
const students = require('../../modules/students');
const { post } = require('./studentsAPI');

router.post('/last', (req, res) => {
    var type = req.body.type;
    const directoryPath = path.join(__dirname, '..', '..', 'storage', 'timetables', 'table_prewievs');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.send({data: `

            <div class="error">
                <div class="warning text-center no-spacing" style="font-size: 1.3em;">
                        <div>
                            <h1>УВАГА</h1>
                            <p>Виникла критична помилка (Error reading directory)</p>
                        </div>
                        <div style="margin-top: 20px;">
                            <small style="margin-top: -10px;">Повідомте адміністратора про виникнення помилки.</small>
                        </div>
                </div>
                <table class="lessons-table" style="filter: blur(3px); height: 100%;">
                    <thead>
                        <tr class="course">
                            <th colspan=19" data-course="1">? КУРС</th>
                        </tr>
                        <tr class="groups">
                            <th class="sticky"></th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                        </tr>
                        <tr class="subgroups">
                            <th class="sticky"></th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="lesson">
                            <td class="number-lesson" data-lesson="1">I</td>
                            <td data-course="1" data-group="A" data-subgroup="1"></td>
                            <td data-course="1" data-group="A" data-subgroup="2"></td>
                            <td data-course="1" data-group="B" data-subgroup="1"></td>
                            <td data-course="1" data-group="B" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                        </tr>
                        <tr class="lesson">
                            <td class="number-lesson" data-lesson="1">I</td>
                            <td data-course="1" data-group="A" data-subgroup="1"></td>
                            <td data-course="1" data-group="A" data-subgroup="2"></td>
                            <td data-course="1" data-group="B" data-subgroup="1"></td>
                            <td data-course="1" data-group="B" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                        </tr>
                        <tr class="lesson">
                            <td class="number-lesson" data-lesson="1">I</td>
                            <td data-course="1" data-group="A" data-subgroup="1"></td>
                            <td data-course="1" data-group="A" data-subgroup="2"></td>
                            <td data-course="1" data-group="B" data-subgroup="1"></td>
                            <td data-course="1" data-group="B" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `, date: "??.??.????"});
            return;
        }

        // Находим файл с последней датой в названии
        const latestFile = findLatestFile(files, type);

        if (!latestFile) {
            res.send({data: `

            <div class="error">
                <div class="warning text-center no-spacing" style="font-size: 1.3em;">
                        <div>
                            <h1>УВАГА</h1>
                            <p>Розклад не знайдено. (File not found)</p>
                        </div>
                        <div style="margin-top: 20px;">
                            <small style="margin-top: -10px;">Повідомте адміністратора про виникнення помилки.</small>
                        </div>
                </div>
                <table class="lessons-table" style="filter: blur(3px); height: 100%;">
                    <thead>
                        <tr class="course">
                            <th colspan=19" data-course="1">? КУРС</th>
                        </tr>
                        <tr class="groups">
                            <th class="sticky"></th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                            <th colspan="2" data-group="?">?</th>
                        </tr>
                        <tr class="subgroups">
                            <th class="sticky"></th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                            <th data-subgroup="?">? ПІДГРУПА</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="lesson">
                            <td class="number-lesson" data-lesson="1">I</td>
                            <td data-course="1" data-group="A" data-subgroup="1"></td>
                            <td data-course="1" data-group="A" data-subgroup="2"></td>
                            <td data-course="1" data-group="B" data-subgroup="1"></td>
                            <td data-course="1" data-group="B" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                        </tr>
                        <tr class="lesson">
                            <td class="number-lesson" data-lesson="1">I</td>
                            <td data-course="1" data-group="A" data-subgroup="1"></td>
                            <td data-course="1" data-group="A" data-subgroup="2"></td>
                            <td data-course="1" data-group="B" data-subgroup="1"></td>
                            <td data-course="1" data-group="B" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                        </tr>
                        <tr class="lesson">
                            <td class="number-lesson" data-lesson="1">I</td>
                            <td data-course="1" data-group="A" data-subgroup="1"></td>
                            <td data-course="1" data-group="A" data-subgroup="2"></td>
                            <td data-course="1" data-group="B" data-subgroup="1"></td>
                            <td data-course="1" data-group="B" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                            <td data-course="1" data-group="F" data-subgroup="1"></td>
                            <td data-course="1" data-group="F" data-subgroup="2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            `, date: "??.??.????"});
            return;
        }

        const filePath = path.join(directoryPath, latestFile);
        res.send({data : `${fs.readFileSync(filePath)}`, date: `${latestFile.split("_")[1]}`});
    });
});

// Функция для поиска файла с последней датой в названии
function findLatestFile(files, type) {
    let latestFile = null;
    let latestDate = 0;

    files.forEach(file => {
        const match = file.match(new RegExp(`table_(\\d{4}-\\d{2}-\\d{2})_${type}`));

        if (match) {
            const fileDate = new Date(match[1]).getTime();

            if (fileDate > latestDate) {
                latestDate = fileDate;
                latestFile = file;
            }
        }
    });

    return latestFile;
}

router.post('/courses', (req, res) => {
    res.send(students.prepareCoursesHTML(req.body.type));
  });

router.post('/groups', (req, res) => {
    res.send(students.prepareGroupsHTML(req.body.type, req.body.course));
  });
router.post('/filter', (req, res) => {
    res.send(api.loadForDate(req.body.type, req.body.date));
  });

module.exports = router;

  