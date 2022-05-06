const express = require("express");
const ReturnOrderDAO = require('../dao/ReturnOrderDAO.js')
const db = new ReturnOrderDAO('EzWh')

const router = express.Router()
router.use(express.json());

//GET /api/returnOrders
router.get('/api/returnOrders', async (req,res)=>{
    try{
        const orders = await db.getReturnOrders();
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    }
  });

//GET /api/returnOrders/:id
router.get('/api/returnOrders/:id', async (req,res)=> {
    try{
    if (req.params.id === undefined || !Number.isInteger(+req.params.id))
        return res.status(422).json({error: `Unprocessable Entity`})

    const order = await db.getReturnOrder(req.params.id);
    if (order === undefined)
        return res.status(404).json({error: `No return order associated to id`})
    return res.status(200).json(order);
    }
    catch(err){
        res.status(500).end();
    }

    });

//POST /api/returnOrder
router.post('/api/returnOrder', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        let order = req.body;
        //Check if any field is empty
        if (order === undefined || order.returnDate === undefined ||
            order.products === undefined || order.restockOrderId === undefined) {
            return res.status(422).json({error: `Invalid order data`});
        }

        let count = await db.checkIfRestockOrderExists(order.restockOrderId);
        if (count == 0) {
            return res.status(404).json({error: `No restock order associated to id`});
        }
        await db.newTableReturnOrders();
        await db.addReturnOrder(order);
        //for each skuItem -> look at sequence diagram

        return res.status(201).end();


    }catch(err){
        res.status(500).end();
    }

});

//DELETE /api/returnOrder/:id
router.delete('/api/returnOrder/:id', async (req,res)=>{
    try{
        const id = req.params.id
        if(!Number.isInteger(+req.params.id))
            return res.status(422).json({error: `Provided ID is invalid`});

        //Delete Restock Order
        await db.deleteReturnOrder(id);
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }
});




module.exports = router
