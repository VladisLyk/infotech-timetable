const fs = require("fs");
const itemsPerPage = 10;

function loadData(req) {
    var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
    const page = parseInt(req.body.page) || 1;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return { data: paginatedData, currentPage: page, total: totalPages };
}

function prepareCoursesHTML(type) {
    var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
    var html = '';
    for (let index = 0; index < data.length; index++) {
        var item = data[index];
        
        if(item.department == type) {
            html += `
                <option value="${item.course}">${item.course}</option>
            `;
        }
    }
    

    return html;
}

function prepareGroupsHTML(type, course) {
    var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
    var html = '';
    for (let index = 0; index < data.length; index++) {
        var item = data[index];
        
        if(item.department == type) {
            if(item.course == course.toString()) {
                item.groups.forEach(group => {
                    html += `
                        <option value="${group}">${group}</option>
                    `;
                });
            }
        }
    }
    

    return html;
}

function prepareHTML(req) {
    var html = '';
    var fullData = loadData(req);
    var currentPage = fullData.currentPage;
    var totalPages = fullData.total;
    var data = fullData.data;

    for (let index = 0; index < data.length; index++) {
        var item = data[index];
        
        let departmentText = item.department;
    
        if (item.department === 'math') {
            departmentText = 'Математичне';
        } else if (item.department === 'phys') {
            departmentText = 'Фізичне';
        }
    
        html += `
            <tr class="row" id="${index}" course="${item.course}">
                <td>${index + 1}</td>
                <td>${departmentText}</td>
                <td>${item.course}</td>
                <td>${item.groups.join(', ')}</td>
            </tr>
        `;
    }
    

    return [html, currentPage, totalPages];
}

function remove(req) {
    try {
        var filePath = "./storage/students.json";
        var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        var removeList = req.body["removeList"].split(";");

        var newData = data.filter(function(item, itemIndex) {
            for (let index = 0; index < removeList.length; index++) {
                if (itemIndex == parseInt(removeList[index])) {
                    return false;
                }
            }
            return true;
        });

        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error processing remove operation:', error.message);
        return false;
    }
}

function checkAddedCourse(req) {
    var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
    const course = parseInt(req.body['course']);
    const type = req.body['type']


    const courseExists = data.some(element => element.course === course && element.department === type);

    return { status: courseExists };
}

function addCourse(req) {
    try {
        var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
        const course = parseInt(req.body['course']);
        const type = req.body['type'];
        const groups = req.body['groups'].split(";");
    
        data[data.length] = {
            course: course,
            department: type,
            groups: groups
        }
    
        fs.writeFileSync("./storage/students.json", JSON.stringify(data, null, 2), 'utf8');
        return { status: true };
    } catch {
        return { status: false };
    }
}
function editCourse(req) {
    try {
        var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
        const course = parseInt(req.body['course']);
        const type = req.body['type'];
        const groups = req.body['groups'].split(";");
    
        data[req.body['id']] = {
            course: course,
            department: type,
            groups: groups
        }
    
        fs.writeFileSync("./storage/students.json", JSON.stringify(data, null, 2), 'utf8');
        return { status: true };
    } catch {
        return { status: false };
    }
}
function addGroup(req) {
    try {
        var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
        const course = parseInt(req.body['course']);
        const type = req.body['type'];
        const group = req.body['group']
        var add = true;
        data.forEach(element => {
            if(element.course == course && element.department == type) {
                element.groups.forEach(element2 => {
                    if(element2 == group) {
                        add = false;
                    }
                });

                if(add) {
                    element.groups[element.groups.length] = group;
                }
            }
        });
        if(add) {
            fs.writeFileSync("./storage/students.json", JSON.stringify(data, null, 2), 'utf8');
            return { status: true };
        } else {
            return { status: false, error_message: "Група з такою назвою вже існує!"};
        }
    } catch {
        return { status: false , error_message: "Виникла помилка №2, зверністься до адміністратору."};
    }
}

function get(id) {
    var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
    if (id-1 < data.length) {
        return data[id];
    } else {
        return null;
    }
}


function data() {
    return JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
}

function checkStudents(department) {
    var data = JSON.parse(fs.readFileSync("./storage/students.json", "utf8"));
    var result = false;

    data.forEach(element => {
        if(element.department == department && element.groups.length != 0) {
            result = true;
        }
    });

    return result;
}



module.exports = {
    loadData,
    prepareHTML,
    remove,
    prepareCoursesHTML,
    checkAddedCourse,
    addCourse,
    addGroup,
    get,
    editCourse,
    data,
    checkStudents,
    prepareGroupsHTML
};
