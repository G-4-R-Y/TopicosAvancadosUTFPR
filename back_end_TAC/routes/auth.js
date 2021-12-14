const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { User } = require('../database/models')

const EXPIRES = 86400;

// Função para gerar o token
function generateToken(params = {}, timeout = EXPIRES) {
  //console.log(process.env.JWT_SECRET);
  //console.log(timeout);
  //console.log(params);
  return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: timeout });
}

// Rota para autenticar o usuário
router.post('/', async (req, res) => {
  const { 'token-timeout': timeout = EXPIRES } = req.headers;

  const { email, password } = req.body;

  const user = await User.findOne({ where: {email, password} });

  if (!user) return res.status(400).json({ message: 'E-mail ou senha inválidos' });

  user.password = undefined;

  const now = new Date();

  return res.json({
    token: generateToken({ id: user.id, email, userType: user.userType }, timeout),
    user,
    loggedIn: now,
    expiresIn: new Date(now.getTime() + timeout * 1000),
  });
});

module.exports = router;