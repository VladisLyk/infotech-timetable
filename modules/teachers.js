const fs = require("fs");
const itemsPerPage = 10;

function loadData(req) {
    var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
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
        
        html += `
            <tr class="row" id="${index}">
                <td>${index + 1}</td>
                <td>${item.fullName}</td>
                <td>${item.email}</td>
            </tr>
        `;
    }
    

    return [html, currentPage, totalPages];
}

function remove(req) {
    try {
        var filePath = "./storage/teachers.json";
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
        var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
        const firstName = req.body['firstName'];
        const lastName = req.body['lastName'];
        const surName = req.body['surName'];
        const email = req.body['email'];
        
        const fullName = lastName + " " + firstName + " " + surName;

        var teacher = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            surName: surName,
            fullName: fullName
        }
        if(data.includes(teacher)) {
            return { status: false, error_message: "Цього викладача вже створений!" };
        } else {
            data[data.length] = teacher;
            fs.writeFileSync("./storage/teachers.json", JSON.stringify(data, null, 2), 'utf8');
            return { status: true };
        }
    } catch {
        return { status: false , error_message: "Виникла внутрішня помилка. Зверністься до адміністрації"};
    }
}

function get(id) {
    var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
    if (id-1 < data.length) {
        return data[id];
    } else {
        return null;
    }
}
function data() {
    var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
    return data;
}

function findBool(fullName) {
    var result = false;
    var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
    data.forEach(element => {
        if(element.fullName == fullName) {
            result = true;
        }
    });

    return result;
}
function getFullName(fullName) {
    var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
    var result = null;
    data.forEach(element => {
        if(element.fullName == fullName) {
            result = element;
        }
    });
    return result;
}
function find(fullName) {
    var result = {};
    var data = JSON.parse(fs.readFileSync("./storage/teachers.json", "utf8"));
    data.forEach(element => {
        if(element.fullName == fullName) {
            result = element;
        }
    });

    return result;
}


module.exports = {
    loadData,
    prepareHTML,
    remove,
    get,
    add,
    findBool,
    find,
    data,
    getFullName
};
