const jwt = require("jsonwebtoken");
const auth = require('../modules/auth');
const fs = require("fs");

function authenticateToken(req, res, next) {
    try {
      const token = req.cookies["x-auth-token"];

      if (!token) return res.redirect("/auth/");
      const decoded = jwt.verify(token, auth.getSecret());
      next();
    } catch(error) {
      res.redirect("/auth/");
    }
}

module.exports = {
  authenticateToken
};
