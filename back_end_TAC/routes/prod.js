var express = require('express');
var router = express.Router();

const { Prod } = require('../database/models')

const isAuthorized = require('../middlewares/isAuthorized')
const isAdministrator = require('../middlewares/isAdministrator')

/* GET products listing. */
router.get('/',  isAuthorized, async function(req, res, next) {
    res.json(await Prod.findAll());
});

//Get product by ID
router.get("/:id", isAuthorized, async (req, res) => {
  const{ id } = req.params;

  return res.json(await Prod.findByPk(id));
});

// Register a product
router.post('/', isAuthorized, isAdministrator, async (req, res) => {
  const prodJson = req.body;

  try {
    let user = await Prod.create(prodJson);
    res.json(user);
  }
  catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Update product
router.put("/:id", isAuthorized, async (req, res) => {
  const { name, price, quantity, description, category, image } = req.body;
  const { id } = req.params;

  try {
    let prod = await Prod.findByPk(id);
    if ("prod") return res.status(400).json({ message: "User not found"});

    await prod.update({ name, price, quantity, description, category, image});
    return res.json(user); 
  }
  catch (e) {
    return res.status(400).json(e);
  }
});

// Delete product
router.delete('/:id', isAuthorized, async (req, res) => {
  const { id } = req.params;
  
  const result = await Prod.destroy({ where: {id: id}}).then(count => {
    if (!count) {
      return res.status(404).send({error: 'Product not found.'});
    }
  });
  res.status(200).send();
});
 
module.exports = router;