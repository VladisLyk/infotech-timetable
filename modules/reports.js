const fs = require("fs");
const path = require('path');

const lessons = require("./lessons");
const teachers = require("./teachers");
const diciplines = require("./diciplines");
const { table } = require("console");
const { report } = require("../routes/admin");

var date = new Date();
date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

function data() {
    var data = JSON.parse(fs.readFileSync("./storage/reporting.json", "utf8"));
    return data;
}

function addHours() {
    if(!lessons.today("phys")) {
        const fileName = path.join(__dirname, '..', 'logs', `report_${date}_phys.log`);
        fs.appendFileSync(fileName, `it is not possible to create a report for ${date} \n (The schedule for ${date} was not created)`, 'utf8');
    } else {

    }

    if(!lessons.today("math")) {
        const fileName = path.join(__dirname, '..', 'logs', `report_${date}_math.log`);
        fs.appendFileSync(fileName, `it is not possible to create a report for ${date} \n (The schedule for ${date} was not created)`, 'utf8');
    } else {

    }
}
function getLessonList() {
    var directoryPath = path.join(__dirname, "..", "storage", "timetables");

    return     fs.readdirSync(directoryPath, {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => item.name);
}
function buildReport() {
    var tablesList = getLessonList();
    var reports = {};

    if (tablesList == null || tablesList.length === 0) {
        console.log("Неможливо створити звіт, немає розкладу.");
    } else {
        var teachersList = teachers.data();
        teachersList.forEach(teacher => {
            var report = {
                "lessons": []
            };

            if (reports.hasOwnProperty(teacher.fullName)) {
                report = reports[teacher.fullName];
            }

            tablesList.forEach(tableFile => {
                var table = lessons.open(tableFile);
                var lesson = table.lessons;

                for (const number in lesson) {
                    const courses = lesson[number]["courses"];

                    for (const course in courses) {
                        const groups = courses[course]["groups"];

                        for (const group in groups) {
                            const subgroups = groups[group]["subgroups"];

                            if (subgroups["1"] && subgroups["2"] &&
                                subgroups["1"].name == subgroups["2"].name &&
                                subgroups["1"].teacher == subgroups["2"].teacher) {
                                var subgroup = subgroups["1"];
                                if (subgroup.name != "" && subgroup.teacher != "") {
                                    var LessonTeacher = subgroup.teacher;

                                    if (teacher.fullName == LessonTeacher) {
                                        report.lessons.push({
                                            "date": table.date,
                                            "number_lesson": number,
                                            "course": course,
                                            "group": group,
                                            "dicipline": subgroup.name,
                                            "type": subgroup.type,
                                            "form": subgroup.form
                                        });
                                    }
                                }
                            } else {
                                Object.values(subgroups).forEach(subgroup => {
                                    if (subgroup.name != "" && subgroup.teacher != "") {
                                        var LessonTeacher = subgroup.teacher;
  
                                        if (teacher.fullName == LessonTeacher) {
                                            report.lessons.push({
                                                "date": table.date,
                                                "number_lesson": number,
                                                "course": course,
                                                "group": group,
                                                "dicipline": subgroup.name,
                                                "type": subgroup.type,
                                                "form": subgroup.form
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });

            if (reports.hasOwnProperty(teacher.fullName)) {
                reports[teacher.fullName].lessons = reports[teacher.fullName].lessons.concat(report.lessons);
            } else {
                reports[teacher.fullName] = {
                    "lessons": report.lessons
                };
            }
        });

        fs.writeFileSync("./storage/reporting.json", JSON.stringify(reports, null, 2), 'utf8');
    }
}
function makeReport(teacher) {
    if(teachers.findBool(teacher)) {
        var reports = data();
        if(reports.hasOwnProperty(teacher)) {
            return {status: true, data: reports[teacher]};
        } else {
            return {status: false, error_message: "Звіт не знайдено, можливо дані ще не було оновлено, повторіть спробу завтра."};
        }
    } else {
        return {status: false, error_message: "Викладача не знайдено."};
    }
}

module.exports = {
    addHours,
    buildReport,
    data,
    makeReport
};
