const fs = require("fs");
const itemsPerPage = 10;

const teachers = require("../modules/teachers");

function loadData(req) {
    var data = JSON.parse(fs.readFileSync("./storage/diciplines.json", "utf8"));
    const page = parseInt(req.body.page) || 1;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return { data: paginatedData, currentPage: page, total: totalPages };
}


function prepareHTML(req) {
    var html = '';
    var fullData = loadData(req);
    var currentPage = fullData.currentPage;
    var totalPages = fullData.total;
    var data = fullData.data;

    for (let index = 0; index < data.length; index++) {
        var item = data[index];
        var type = "";

        if(item.type == "categorical") {
            type = "<span class='categorical'>Категорійна</span>"
        } else if (item.type == "professional") {
            type = "<span class='professional'>Фахова</span>"
        } else {
            type = "<span class='interdisciplinary'>Міжгалузева</span>"
        }

        var teachersList = "";
        var teach = "";
        var emails = "";

        for (let index = 0; index < item.teachers.length; index++) {
            const element = item.teachers[index];
            if(!teachers.findBool(element)) {
                teachersList += "<span style='opacity: 0.5;'>" + element + " (не створений)</span><br>"
            } else {
                teachersList += "<span>" + element + "</span><br>" 
            }

            var teacher = teachers.find(element);

            if(index+1 != item.teachers.length) {
                teach += teacher.fullName + ";";
                emails += teacher.email + ";";
            } else {
                teach += teacher.fullName;
                emails += teacher.email;
            }
        }

        if(item.type == "categorical") {
            html += `
            <tr class="row" id="${index}" categorical="1" dname="${item.name}" dteach="${teach}" demails="${emails}">
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${teachersList}</td>
                <td>${type}</td>
            </tr>
        `;
        } else {
            html += `
            <tr class="row" id="${index}" dname="${item.name}" dteach="${teach}" demails="${emails}">
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${teachersList}</td>
                <td>${type}</td>
            </tr>
        `;
        }
    }
    

    return [html, currentPage, totalPages];
}

function remove(req) {
    try {
        var filePath = "./storage/diciplines.json";
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


function add(req) {
    try {
        var data = JSON.parse(fs.readFileSync("./storage/diciplines.json", "utf8"));
        const name = req.body['name'];
        const teachers = req.body['teachers'];
        const type = req.body['type'];


        var dicipline = {
            name: name,
            teachers: teachers.split(";"),
            type: type
        }
        var created = data.some(element => {
            return (
                element.name === dicipline.name &&
                element.teachers.every(t => dicipline.teachers.includes(t)) &&
                element.type === dicipline.type
            );
        });
        
        if(created) {
            return { status: false, error_message: "Дисципліна вже існує!" };
        } else {
            data[data.length] = dicipline;
            fs.writeFileSync("./storage/diciplines.json", JSON.stringify(data, null, 2), 'utf8');
            return { status: true };
        }

    } catch {
        return { status: false , error_message: "Виникла внутрішня помилка. Зверністься до адміністрації"};
    }
}

function get(id) {
    var data = JSON.parse(fs.readFileSync("./storage/diciplines.json", "utf8"));
    if (id-1 < data.length) {
        return data[id];
    } else {
        return null;
    }
}
function getName(name) {
    var data = JSON.parse(fs.readFileSync("./storage/diciplines.json", "utf8"));
    var result = null;
    data.forEach(element => {
        if(element.name == name) {
            result = element;
        }
    });

    return result;
}

function findSimilarTeacher(inputName, data) {
    const regex = new RegExp(inputName, 'i');
    return data.filter(teacher => regex.test(teacher.fullName));
  }
  
  function findSimilar(req) {
    const data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
  
    const inputName = req.body.name;
  
    const similarTeachers = findSimilarTeacher(inputName, data);
        
    var result = "";
    for (const teacher of similarTeachers) {
        result += `<button class="teach-btn">${teacher.fullName}</button>`;
    }

    if(similarTeachers.length == 0) {
        result = '<p style="margin: 10px; font-size: 13px;">За вашим запитом нічого не знайдено!</p>';
    }
  
    return {data: result};
  }

  function data() {
    return JSON.parse(fs.readFileSync("./storage/diciplines.json", "utf8"));
  }

module.exports = {
    loadData,
    prepareHTML,
    remove,
    get,
    add,
    findSimilar,
    data,
    getName
};
