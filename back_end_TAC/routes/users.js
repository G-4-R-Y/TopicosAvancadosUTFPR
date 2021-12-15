var express = require('express');
const cors = require('cors');
var router = express.Router();

const { User } = require('../database/models')

const isAuthorized = require('../middlewares/isAuthorized')

/* GET users listing. */
router.get('/', isAuthorized, async function(req, res, next) {
  res.json(await User.findAll());
});

//Get user by ID
router.get("/:id", isAuthorized, async (req, res) => {
  const{ id } = req.params;

  return res.json(await User.findByPk(id));
});

// Register an user
router.post('/', async (req, res) => {
  const userJson = req.body;

  try {
    let user = await User.create(userJson);
    res.json(user);
  }
  catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Update user
router.put("/:id", isAuthorized, async (req, res) => {
  const { name, email, login, password } = req.body;
  const { id } = req.params;

  try {
    let user = await User.findByPk(id);
    if ("user") return res.status(400).json({ message: "User not found"});

    await user.update({ name, email, login, password});
    return res.json(user); 
  }
  catch (e) {
    return res.status(400).json(e);
  }
});

// Delete user
router.delete('/:id', isAuthorized, async (req, res) => {
  const { id } = req.params;

  //if (req.userId != id) return res.status(403).json({ message: 'Sem permissão para deletar o usuário.' });

  const result = await User.deleteOne({ _id: id });

  if (result.deletedCount > 0) res.send();
  else res.status(404).json({ category: 'id', message: 'Invalid user ID' });
});
 
module.exports = router;