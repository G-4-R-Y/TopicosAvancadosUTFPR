var express = require('express');
const cors = require('cors');
var router = express.Router();
const { Order, Prod, ProdOrder } = require('../database/models');
//const order = require('../database/models/order');
const corsAllow = require('../middlewares/corsAllow');
const isAuthorized = require('../middlewares/isAuthorized')

/* GET order listing. */
router.get('/', corsAllow, isAuthorized, async function(req, res, next) {
    res.json(await Order.findAll());
});

/* GET all user orders from user ID */
router.get("/user/:id", corsAllow, isAuthorized, async (req, res) => {
  const { id } = req.params;
  const order = await Order.findAll({where: {userId: id}});
  return res.json(order)
});

/* GET all products from order ID */
router.get("/productslist/:id", corsAllow, isAuthorized, async (req, res) => {
  const { id } = req.params;
  const orderProducts = await ProdOrder.findAll({where: {order_id: id}});
  return res.json(orderProducts)
});

//Get order by ID
router.get("/:id", corsAllow, isAuthorized, async (req, res) => {
  const{ id } = req.params;
  console.log(id);
  return res.json(await Order.findByPk(id));
});

// CREATE order
router.post('/', corsAllow, isAuthorized, async (req, res) => {
  const { products } = req.body;
  const { id } = req.user;
  console.log(id);

  //if (products.length == 0) return res.status(102));

  // prods availability
  for (let i = 0; i < products.length; i++) {  
    const prod = await Prod.findByPk(products[i].id);
    if (prod.quantity < products[i].quantity) return res.status(101).json({message: "Não há a quantidade solicitada de " + prod.name + " disponível."});
  }

  // update prod quantities
  for (let i = 0; i < products.length; i++) {
    const prod = await Prod.findByPk(products[i].id);
    await prod.update({quantity: prod.quantity - products[i].quantity});
  }

  try {
    // create order
    const order = Order.create({userId: id}).then(async result => {
      const order_id = result.id;
      console.log(order_id)
      for (let i = 0; i < products.length; i++) {
        const prod = await Prod.findByPk(products[i].id);
        ProdOrder.create({ prod_id: products[i].id, order_id: order_id, quantity: prod.quantity, category: prod.category});
      }
    });
    res.json(order);
  }
  catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Update order
router.put("/:id", corsAllow, isAuthorized, async (req, res) => {
  const { id } = req.params;

  try {
    let order = await Order.findByPk(id);
    if ("order") return res.status(404).json({ message: "Order não encontrado."});
    if (order.status != "Pagamento Pendente") return res.status(400).json({message: "Ordem não está com o pagamento pendente."})
    await order.update({ status: "Pagamento confirmado." });
    return res.json(order); 
  }
  catch (e) {
    return res.status(400).json(e);
  }
});

// Delete order
router.delete('/:id', corsAllow, isAuthorized, async (req, res) => {
  const { id } = req.params;

  //if (req.userId != id) return res.status(403).json({ message: 'Sem permissão para deletar o usuário.' });

  const order = await Order.findByPk(id);
  if (!order) return res.status(404).json({message: "Order not found."})

  const prodOrders = await ProdOrder.findAll({ where: {'order_id': id} })

  for (let i = 0; i < prodOrders.length; i++) {
    const prod = await Prod.findByPk(prodOrders[i].prod_id)
    await prod.update({quantity: prod.quantity + prodOrders[i].quantity})
  }

  for (let i = 0; i < prodOrders.length; i++) {
    await prodOrders[i].destroy();
  }

  result = await order.destroy()

  res.status(200).send();
});
 
module.exports = router;