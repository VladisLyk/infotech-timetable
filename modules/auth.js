const fs = require("fs");

function checkLogin(user, password) {
    return (getUser() == user 
    && getPassword() == password);
}

function getSecret() {
    return JSON.parse(fs.readFileSync("./storage/admin.json", "utf8")).secret;
}

function getUser() {
    return JSON.parse(fs.readFileSync("./storage/admin.json", "utf8")).user;
}

function getPassword() {
    return JSON.parse(fs.readFileSync("./storage/admin.json", "utf8")).password;
}

module.exports = {
    checkLogin,
    getSecret,
  };