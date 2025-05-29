const jwt = require("jsonwebtoken");
const auth = require('../modules/auth');

function apiAuth(req, res, next) {
  try {
    const token = req.cookies["x-auth-token"];

    if (!token) return res.sendStatus(403);;
    const decoded = jwt.verify(token, auth.getSecret());
    next();
  } catch(error) {
    res.sendStatus(403);
  }
}

module.exports = {
  apiAuth
};
