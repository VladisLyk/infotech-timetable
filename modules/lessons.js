const fs = require("fs");
const path = require('path');

const students = require("../modules/students");
const diciplines = require("../modules/diciplines");
const teachers = require("../modules/teachers");
const { group } = require("console");

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
function getListTables(type) {
    const directoryPath = path.join(__dirname, '..', 'storage', 'timetables');

    try {
        var files = fs.readdirSync(directoryPath);
        var filteredFiles = [];
        
        files.forEach(element => {

            var fileNameWithoutExtension = element.replace(".json", "");
            var file = fileNameWithoutExtension.split("_")[2];
            
            if (file === type) {
                filteredFiles.push(element);
            }
        });

        return filteredFiles;
    } catch (err) {
        return [];
    }
}

var itemsPerPage = 5;
function loadData(req) {
    var data = getListTables(req.body.type);
    const page = parseInt(req.body.page) || 1;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return { data: paginatedData, currentPage: page, total: totalPages };
}

function checkFileForToday(type) {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;
    const filePath = path.join(__dirname, '..', 'storage', 'timetables', `table_${formattedDate}_${type}.json`);

    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function checkFileForDate(inputDate, type) {
    const dateParts = inputDate.split('-');
    if (dateParts.length !== 3) {
        throw new Error('Invalid date format. Please use yyyy-mm-dd.');
    }

    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date format. Please use valid numbers for year, month, and day.');
    }

    const formattedDate = `${year}-${month}-${day}`;
    const filePath = path.join(__dirname, '..', 'storage', 'timetables', `table_${formattedDate}_${type}.json`);

    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function checkFile(filename) {
    const filePath = path.join(__dirname, '..', 'storage', 'timetables', `${filename}`);

    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function today(type) {
    return checkFileForToday(type);
}
function loadForDate(type, date) {
    const formattedDate = date;
    if(checkFileForDate(date, type)) {
        return {error: false, html: showTable(formattedDate, type)};
    } else {
        return {error: true, html: `
        
        <div class="error">
        <div class="warning text-center no-spacing" style="font-size: 1.3em;">
                <div>
                    <h1>УВАГА</h1>
                    <p>Розклад не знайдено. (File not found)</p>
                </div>
                <div style="margin-top: 20px;">
                    <small style="margin-top: -10px;">Спробуйте встановити інший фільтр.</small>
                </div>
        </div>
        <table class="lessons-table" style="filter: blur(3px); height: 100%;">
            <thead>
                <tr class="course">
                    <th colspan=7" data-course="1">? КУРС</th>
                </tr>
                <tr class="groups">
                    <th class="sticky"></th>
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
                </tr>
                <tr class="lesson">
                    <td class="number-lesson" data-lesson="1">I</td>
                    <td data-course="1" data-group="A" data-subgroup="1"></td>
                    <td data-course="1" data-group="A" data-subgroup="2"></td>
                    <td data-course="1" data-group="B" data-subgroup="1"></td>
                    <td data-course="1" data-group="B" data-subgroup="2"></td>
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
                </tr>
            </tbody>
        </table>
    </div>
        
        `};
    }
}
function loadToday(type) {

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;
    if(today(type)) {
        return showTable(formattedDate, type);
    } else {
        return `
        
                        <div class="warning text-center no-spacing">
                            <div>
                                <h1>УВАГА!</h1>
                                <p>Розкладу на сьогодні немає</p>
                            </div>
                            <button class="default-btn-dark mt-1" onclick="openModal('create-lessons')" >Створити</button>
                        </div>
        
        `;
    }
}

function buildEmpty(department) {
    var studentsList = students.data();
    var filteredData = [];

    studentsList.forEach(element => {
        if(element.department == department) {
            filteredData[filteredData.length] = element;
        }
    });

    var courses = [];
    var groups = [];
    var subgroups = [];
    var lessons = [];

    for (let index = 0; index < filteredData.length; index++) {
        const element = filteredData[index];
        var countGroups = element.groups.length;


        if(index == 0) {
            courses[courses.length] = `<th colspan="${(countGroups*2)+1}" data-course="${element.course}">${element.course} КУРС</th>`;
        } else {
            courses[courses.length] = `<th colspan="${countGroups*2}" data-course="${element.course}">${element.course} КУРС</th>`
        }

        element.groups.forEach(group => {
            groups[groups.length] = `<th colspan="2" data-group="${group}">${group}</th>`;
            lesson = [];

            for (let subgroup = 1; subgroup <= 2; subgroup++) {
                subgroups[subgroups.length] = `<th data-subgroup="${subgroup}">${subgroup} ПІДГРУПА</th>`;
                lesson[lesson.length] = `<td data-course="${element.course}" data-group="${group}" data-subgroup="${subgroup}"></td>`;
            }

            lessons[lessons.length] = lesson;
        });
    }
    var table = `<table class="lessons-table">`;

    var thead = `<thead><tr class="course">`;

    courses.forEach(element => {
        thead += element ;
    });

    thead += " </tr>";

    thead += `<tr class="groups"><th class="sticky"></th>`;

    groups.forEach(element => {
        thead += element ;
    });
    thead += "</tr>";

    thead += `<tr class="subgroups"><th class="sticky"></th>`;

    subgroups.forEach(element => {
        thead +=  element ;
    });
    thead += " </tr>";
    thead += "</thead>";

    var tbody = `<tbody>`;

    for (let lesson = 1; lesson <= 6; lesson++) {
        var tr = `<tr class="lesson"><td class="number-lesson" data-lesson="${lesson}">${lesson}</td>`;

        lessons.forEach(element => {
            tr += element ;
        });

        tr += "</tr>"
        
        tbody += tr;
    }

    tbody += `</tbody>`;


    table += thead;
    table += tbody;
    table += `</table>`;

    return table;
}
function showTable(date, type) {
    const directoryPath = path.join(__dirname, '..', 'storage', 'timetables', 'table_prewievs', `table_${date}_${type}.html`);

    try {
        const fileContent = fs.readFileSync(directoryPath, 'utf8');
        return fileContent;
    } catch (err) {
        return `
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
                    <th colspan=7" data-course="1">? КУРС</th>
                </tr>
                <tr class="groups">
                    <th class="sticky"></th>
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
                </tr>
                <tr class="lesson">
                    <td class="number-lesson" data-lesson="1">I</td>
                    <td data-course="1" data-group="A" data-subgroup="1"></td>
                    <td data-course="1" data-group="A" data-subgroup="2"></td>
                    <td data-course="1" data-group="B" data-subgroup="1"></td>
                    <td data-course="1" data-group="B" data-subgroup="2"></td>
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
                </tr>
            </tbody>
        </table>
    </div>
        `;
    }
}
function buildTableHTML(filename, data, department) {
    var studentsList = students.data();
    var filteredData = [];

    studentsList.forEach(element => {
        if(element.department == department) {
            filteredData[filteredData.length] = element;
        }
    });

    var courses = [];
    var groups = [];
    var subgroups = [];
    var lessons = [];

    for (let index = 0; index < filteredData.length; index++) {
        const element = filteredData[index];
        var countGroups = element.groups.length;


        if(index == 0) {
            courses[courses.length] = `<th colspan="${(countGroups*2)+1}" data-course="${element.course}">${element.course} КУРС</th>`;
        } else {
            courses[courses.length] = `<th colspan="${countGroups*2}" data-course="${element.course}">${element.course} КУРС</th>`
        }

        element.groups.forEach(group => {
            groups[groups.length] = `<th colspan="2" data-group="${group}">${group}</th>`;
            lesson = [];

            for (let subgroup = 1; subgroup <= 2; subgroup++) {
                subgroups[subgroups.length] = `<th data-subgroup="${subgroup}">${subgroup} ПІДГРУПА</th>`;
            }

            lessons[lessons.length] = lesson;
        });
    }
    var table = `<table class="lessons-table">`;

    var thead = `<thead><tr class="course">`;

    courses.forEach(element => {
        thead += element ;
    });

    thead += " </tr>";

    thead += `<tr class="groups"><th class="sticky"></th>`;

    groups.forEach(element => {
        thead += element ;
    });
    thead += "</tr>";

    thead += `<tr class="subgroups"><th class="sticky"></th>`;

    subgroups.forEach(element => {
        thead +=  element ;
    });
    thead += " </tr>";
    thead += "</thead>";

    var tbody = `<tbody>`;

    for (let lesson = 1; lesson <= 6; lesson++) {
        var tr = `<tr class="lesson"><td class="number-lesson" data-lesson="${lesson}">${lesson}</td>`;
    
        let previousData = null;
        let colspan = 1;
    
        filteredData.forEach(element => {
            element.groups.forEach(group => {
                for (let index = 1; index <= 2; index++) {
                    const subgroup = index;
                    const currentData = generateTD(data["lessons"][lesson], element.course, group, subgroup);
    
                    if (previousData === currentData && currentData !== "") {
                        colspan++;
                    } else {
                        if (previousData !== null) {
                            const colspanAttribute = colspan > 1 ? ` colspan="${colspan}"` : "";
                            const classShared = colspan > 1 ? ` class="shared"` : "";
                            tr += `<td${classShared}${colspanAttribute}>${previousData}</td>`;
                        }
    
                        previousData = currentData;
                        colspan = 1;
                    }
                }
            });
        });
    
        // Добавляем последний элемент после выхода из цикла
        if (previousData !== null) {
            const colspanAttribute = colspan > 1 ? ` colspan="${colspan}"` : "";
            const classShared = colspan > 1 ? ` class="shared"` : "";
            tr += `<td${classShared}${colspanAttribute}>${previousData}</td>`;
        }
    
        tr += "</tr>";
    
        tbody += tr;
    }
    
    

    tbody += `</tbody>`;


    table += thead;
    table += tbody;
    table += `</table>`;

    const path2 = path.join(__dirname, '..', 'storage', 'timetables', "table_prewievs", filename);
    if(fs.existsSync(path2)) {
        fs.unlinkSync(path2);
    }

    fs.appendFileSync(path2, table, 'utf8');
}
function generateTD(lesson, course, group, subgroup) {

        var dicip = lesson["courses"][course]["groups"][group]["subgroups"][subgroup];

        if(dicip.name != "") {
        var dform = dicip.form.split(";");

        var formsList = [];
        for (let index = 0; index < dform.length; index++) {
            const form = dform[index];

            if(form == "offline") {
                formsList.push("ауд. " + dicip.classroom.split(";")[index]);
            } else {
                formsList.push(dicip.email.split(";")[index]);
            }
        }


        var dname = dicip.name;
        var f_dname = dname.replace(";", "/");
        
        var dteach = dicip.teacher;
        var f_teach = dteach.replace(";", "/");

            return `
            
            <div class='move' data-course="${course}" data-group="${group}">
                        <div class="info" style="padding: 5px;">
                            <div class="header text-center">
                                <h4>${f_dname}</h4>
                                <p>${f_teach}</p>
                            </div>
                            <div class="additionalInfo text-center">
                                <div class="wrapper">
                                    <div id="offlineInfo" style="display: block;">
                                        <p>${formsList.join("/")}</p>
                                    </div>
    
                                </div>
                            </div>
                        </div>
                    </div>
            
            `;
        } else {
            return ``;
        }
}

function generateEditTable(filename) {
    var data = open(filename);
    var type = filename.split("_")[2];

    var department = type.replace(".json", "");
    var studentsList = students.data();
    var filteredData = [];

    studentsList.forEach(element => {
        if(element.department == department) {
            filteredData[filteredData.length] = element;
        }
    });

    var courses = [];
    var groups = [];
    var subgroups = [];
    var lessons = [];

    for (let index = 0; index < filteredData.length; index++) {
        const element = filteredData[index];
        var countGroups = element.groups.length;


        if(index == 0) {
            courses[courses.length] = `<th colspan="${(countGroups*2)+1}" data-course="${element.course}">${element.course} КУРС</th>`;
        } else {
            courses[courses.length] = `<th colspan="${countGroups*2}" data-course="${element.course}">${element.course} КУРС</th>`
        }

        element.groups.forEach(group => {
            groups[groups.length] = `<th colspan="2" data-group="${group}">${group}</th>`;
            lesson = [];

            for (let subgroup = 1; subgroup <= 2; subgroup++) {
                subgroups[subgroups.length] = `<th data-subgroup="${subgroup}">${subgroup} ПІДГРУПА</th>`;
            }

            lessons[lessons.length] = lesson;
        });
    }
    var table = `<table class="lessons-table">`;

    var thead = `<thead><tr class="course">`;

    courses.forEach(element => {
        thead += element ;
    });

    thead += " </tr>";

    thead += `<tr class="groups"><th class="sticky"></th>`;

    groups.forEach(element => {
        thead += element ;
    });
    thead += "</tr>";

    thead += `<tr class="subgroups"><th class="sticky"></th>`;

    subgroups.forEach(element => {
        thead +=  element ;
    });
    thead += " </tr>";
    thead += "</thead>";

    var tbody = `<tbody>`;

    for (let lesson = 1; lesson <= 6; lesson++) {
        var tr = `<tr class="lesson"><td class="number-lesson" data-lesson="${lesson}">${lesson}</td>`;
        
        let first = true;
        let previousData = null;
        let colspan = 1;
    
        var d_nones = [];
        var attrs = "";
    
        filteredData.forEach(element => {
            element.groups.forEach(group => {
                for (let index = 1; index <= 2; index++) {
                    const subgroup = index;
                    const currentData = generateAdminTD(data["lessons"][lesson], element.course, group, subgroup);
    
                    if (first) {
                        attrs = ` data-course="${element.course}" data-group="${group}" data-subgroup="${subgroup}"`;
                        first = false;
                    }
    
                    if (previousData === currentData && currentData !== "") {
                        d_nones.push(`<td class="d-none" data-course="${element.course}" data-group="${group}" data-subgroup="${subgroup}"></td>`);
                        colspan++;
                    } else {
                        if (previousData !== null) {
                            const colspanAttribute = colspan > 1 ? ` colspan="${colspan}" next-colspan="${colspan + 1}"${attrs}` : attrs;
                            const classShared = colspan > 1 ? ` class="shared"` : "";
    
                            tr += `<td${classShared}${colspanAttribute}>${previousData}</td>`;
                            tr += d_nones.join('');
                        }
    
                        previousData = currentData;
                        colspan = 1;
                        d_nones = [];
                        attrs = ` data-course="${element.course}" data-group="${group}" data-subgroup="${subgroup}"`;
                    }
                }
            });
        });
    
        // Додаємо останній елемент після виходу з циклу
        if (previousData !== null) {
            const colspanAttribute = colspan > 1 ? ` colspan="${colspan}" next-colspan="${colspan + 1}"${attrs}` : attrs;
            const classShared = colspan > 1 ? ` class="shared"` : "";
            tr += `<td${classShared}${colspanAttribute}>${previousData}</td>`;
    
            tr += d_nones.join('');
        }
    
        tr += "</tr>";
    
        tbody += tr;
    }
    
    
    
    

    tbody += `</tbody>`;


    table += thead;
    table += tbody;
    table += `</table>`;

    return table;
}
function generateAdminTD(lesson, course, group, subgroup) {

    var dicip = lesson["courses"][course]["groups"][group]["subgroups"][subgroup];
    var elements = ``;

    if(dicip.name != "") {

        for (let index = 0; index < dicip.name.split(";").length; index++) {
            var name = dicip.name.split(";")[index];
            var selected_teacher = dicip.teacher.split(";")[index];

            var dicipline = diciplines.getName(name);
            var teachersList = dicipline.teachers;

            var email = teachers.getFullName(selected_teacher).email;
            var classroom = dicip.classroom.split(";")[index];
            var form = dicip.form.split(";")[index];
            lesson_form = `
            <div class="options w-100 text-center" style="padding-top: 10px;">
                <p style="margin: 0; padding: 0;">Форма навчання:</p>
                <div class="teach-form">
                    <button class="teach-btn teach-offline btn active">Офлайн</button>
                    <button class="teach-btn teach-online btn">Онлайн</button>
                </div>
            </div>
            <div class="additionalInfo text-center">
                <div class="wrapper">
                    <div id="offlineInfo" style="display: block;">
                        <label for="classroomNumber">Номер аудиторії:</label>
                        <input type="text" id="classroomNumber" class="input" value="${classroom}" name="classroomNumber">
                    </div>
                    <div id="onlineInfo" style="display: none;">
                        <label for="email">Електронна пошта:</label>
                        <input type="email" class="input" id="email" name="email" value="${email}">
                    </div>
                </div>
            </div>
            
            `;

            var type = dicip.type.split(";")[index];
            var type_lesson = `
            
            
            <div class="type-lesson" style="text-align: end;">
            <label for="lessonType">Тип заняття:</label>
                <select id="lessonTypeSelect" class="input" name="lessonType">
                    <option value="lection" title="Лекція" ${type === "lection" ? "selected" : ""}>Лекція</option>
                    <option value="practice" title="Практика" ${type === "practice" ? "selected" : ""}>Практика</option>
                    <option value="laboratory" title="Лабораторне заняття" ${type === "laboratory" ? "selected" : ""}>Лабораторне заняття</option>
                    <option value="consultation" title="Консультація" ${type === "consultation" ? "selected" : ""}>Консультація</option>
                    <option value="examination-consultation" title="Екзаменаційна консультація" ${type === "examination-consultation" ? "selected" : ""}>Екзаменаційна консультація</option>
                    <option value="check-control-works" title="Перевірка контр. робіт, РГР" ${type === "check-control-works" ? "selected" : ""}>Перевірка контр. робіт, РГР</option>
                    <option value="course-works" title="Курсові роботи" ${type === "course-works" ? "selected" : ""}>Курсові роботи</option>
                    <option value="examination" title="Екзамени" ${type === "examination" ? "selected" : ""}>Екзамени</option>
                    <option value="practice-guidance" title="Керівництво практикою" ${type === "practice-guidance" ? "selected" : ""}>Керівництво практикою</option>
                    <option value="state-examination" title="Державні іспити" ${type === "state-examination" ? "selected" : ""}>Державні іспити</option>
                    <option value="qualification-works" title="Кваліфікаційні роботи" ${type === "qualification-works" ? "selected" : ""}>Кваліфікаційні роботи</option>
                    <option value="guidance-graduate-students" title="Керівництво аспірантами" ${type === "guidance-graduate-students" ? "selected" : ""}>Керівництво аспірантами</option>
                </select>

        </div>
            
            
            `;

            if(form == "online") {
                lesson_form = `
                <div class="options w-100 text-center" style="padding-top: 10px;">
                    <p style="margin: 0; padding: 0;">Форма навчання:</p>
                    <div class="teach-form">
                        <button class="teach-btn teach-offline btn">Офлайн</button>
                        <button class="teach-btn teach-online btn active">Онлайн</button>
                    </div>
                </div>
                <div class="additionalInfo text-center">
                    <div class="wrapper">
                        <div id="offlineInfo" style="display: none;">
                            <label for="classroomNumber">Номер аудиторії:</label>
                            <input type="text" id="classroomNumber" class="input" value="${classroom}" name="classroomNumber">
                        </div>
                        <div id="onlineInfo" style="display: block;">
                            <label for="email">Електронна пошта:</label>
                            <input type="email" class="input" id="email" name="email" value="${email}">
                        </div>
                    </div>
                </div>
                
                `;
            }

            var teachers_select = `
            
            <select id="selectTeach" class="input" name="teacherSelect">
                ${getTeacherOptions(teachersList, selected_teacher)}
            </select>
            
            `;


            
            elements += `
            
        <div class='move'>
            <div class="d-flex justify-content-between align-center controls">
                <div class="cell">
                    <button class='default-btn add' onclick=""><i class="fas fa-plus"></i></button>
                    <button class='remove default-btn'><i class="fas fa-minus"></i></button>    
                </div>
                ${type_lesson}
            </div>
            <div class="info" style="padding: 5px;">
                <div class="header text-center">
                    <h4>${name}</h4>
                    <p>${teachers_select}</p>
                </div>
                ${lesson_form}
            </div>
            <div class="d-flex justify-content-between">
            <div style="text-align: start;">
            <button class="default-btn remove-move" style=" padding: 8px;"><i class="fas fa-trash"></i> </button>
            </div>
            <div style="text-align: end;">
            <button class="default-btn lock-cell" style=" padding: 8px;"><i class="fas fa-lock"></i><i class="fas fa-unlock"></i></button>
            </div>
            </div>
        </div>
            `;
            
        }
        return elements;

    } else {
        return ``;
    }
}
function getTeacherOptions(array, selected) {
    var elem = ""
    for (let index = 0; index < array.length; index++) {

        var teacher = teachers.getFullName(array[index]);
        if(teacher.fullName == selected) {
            elem += `<option email="${teacher.email}" selected>${teacher.fullName}</option>`;
        } else {
            elem += `<option email="${teacher.email}">${teacher.fullName}</option>`;
        }
    }

    return elem;
}
function open(file) {
    const fileName = path.join(__dirname, '..', 'storage', 'timetables', file);
    return JSON.parse(fs.readFileSync(fileName, "utf8"));

}
function save(data, type, date) {
    try {
        data = JSON.parse(data);

        if (checkFileForDate(date, type)) {
            return { status: false, error_message: `Виникла внутрішня помилка. Файл з розкладом за ${date} вже існує`, error: "already_error" };
        } else {
            if (type == "phys" || type == "math") {
                const fileName = path.join(__dirname, '..', 'storage', 'timetables', `table_${date}_${type}.json`);

                var table = {
                    date: "",
                    lessons: {}
                };
                table.date = date;
                table.lessons = data;


                fs.appendFileSync(fileName, JSON.stringify(table, null, 2), 'utf8');
                buildTableHTML(`table_${date}_${type}.html`, open(`table_${date}_${type}.json`), type);

                return { status: true };
            } else {
                return { status: false, error_message: "Виникла внутрішня помилка. Зверніться до адміністрації (type = undefined)", error: "crit_error" };
            }
        }
    } catch (error) {
        return { status: false, error_message: "Виникла внутрішня помилка. Зверніться до адміністрації", error: "crit_error", error_m: error};
    }
}

function replace(data, type, date) {
    try {
        data = JSON.parse(data);

        if (checkFileForDate(date, type)) {
            if (type == "phys" || type == "math") {
                const fileName = path.join(__dirname, '..', 'storage', 'timetables', `table_${date}_${type}.json`);

                var table = {
                    date: "",
                    lessons: {}
                };
                table.date = date;
                table.lessons = data;

                fs.unlinkSync(fileName);
                fs.appendFileSync(fileName, JSON.stringify(table, null, 2), 'utf8');
                buildTableHTML(`table_${date}_${type}.html`, open(`table_${date}_${type}.json`), type);

                return { status: true };
            } else {
                return { status: false, error_message: "Виникла внутрішня помилка. Зверніться до адміністрації (type = undefined)", error: "crit_error" };
            }
        } else {
            return { status: false, error_message: `Виникла внутрішня помилка. Файл з розкладом за ${date} не існує`, error: "already_error" };
        }
    } catch (error) {
        return { status: false, error_message: "Виникла внутрішня помилка. Зверніться до адміністрації", error: "crit_error", error_m: error};
    }
}

function prepareHTML(req) {
    var html = '';
    var fullData = loadData(req);
    var currentPage = fullData.currentPage;
    var totalPages = fullData.total;
    var data = fullData.data;

    for (let index = 0; index < data.length; index++) {
        var item = data[index];
        var item_name = item.replace(req.type + ".json", "");
        // YYYY-M-D
        var itemDate = new Date(item.split("_")[1]);
        var currentDate = new Date();
        var timeDiff = currentDate - itemDate;
        var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        var dateTD = "";

        if (daysDiff === 1) {
            dateTD = "Вчора";
        } else if (daysDiff === 2) {
            dateTD = "Позавчора";
        } else {
            dateTD = itemDate.toLocaleDateString(); // Или используйте другой формат вывода даты
        }
        var type = "";
        if(req.body.type == "phys") {
            type = "Фізичне";
        } else {
            type = "Математичне"
        }

        html += `
            <tr class="row">
                <td>${index + 1}</td>
                <td>${dateTD}</td>
                <td>${type}</td>
                <td class="d-flex">
                
                    <button class="professional-btn m-1" file="${item}">Переглянути</button>
                    <button class="edit-btn m-1" file="${item}">Змінити</button>

                </td>
            </tr>
        `;
    }

    return [html, currentPage, totalPages];
}


module.exports = {
    today,
    buildEmpty,
    checkFileForDate,
    save,
    open,
    buildTableHTML,
    loadToday,
    showTable,
    prepareHTML,
    checkFile,
    generateEditTable,
    replace,
    loadForDate
};
