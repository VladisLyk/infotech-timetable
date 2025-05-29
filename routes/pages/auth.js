const express = require('express');
const jwt = require("jsonwebtoken");
const jwtMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();
const auth = require('../../modules/auth');

router.get('/', (req, res) => {
  res.render('auth', { "title": "Авторизація" });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (auth.checkLogin(username, password)) {
    const user = {
      username: username,
    };

    const token = jwt.sign(user, auth.getSecret(), { expiresIn: '1h' });

    res.cookie('x-auth-token', token, { httpOnly: true, maxAge: 3600000 });
    res.send({ error: false });
  } else {
    res.send({ error: true, errorMessage: 'Неправильний логін або пароль' });
  }
});

module.exports = router;
