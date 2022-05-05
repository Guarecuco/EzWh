const express = require("express");
const RestockOrderDAO = require('../dao/RestockOrderDAO.js')
const db = new RestockOrderDAO('EzWh')

const router = express.Router()
router.use(express.json());

//GET /api/restockOrders
router.get('/api/restockOrders', async (req,res)=>{
    try{
        const orders = await db.getAllRestockOrders();
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    }
  
});

//GET /api/restockOrdersIssued
router.get('/api/restockOrdersIssued', async (req,res)=>{
    try{
        const orders = await db.getAllRestockOrdersIssued();
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    }
  
});

//GET /api/restockOrdersIssued
router.get('/api/restockOrders/:id', async (req,res)=>{
    try{
        const orders = await db.getRestockOrder(req.body);
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    }
  
});

//GET /api/restockOrders/:id/returnItems
router.get('/api/restockOrders/:id/returnItems', async (req,res)=>{
    try{
        const items = await db.getReturnableItems(req.body);
        return res.status(200).json(items);
    }
    catch(err){
        res.status(500).end();
    }
  
});

//POST /api/restockOrder
router.post('/api/restockOrder', async (req,res)=>{
    try{
        console.log(req.body)

        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
          }
        let order = req.body;
          //Check if any field is empty
        if (order === undefined || order.issueDate === undefined ||
            order.supplierId === undefined) {
                return res.status(422).json({error: `Invalid order data`});
        }

        await db.newTableRestockOrders();

        
        
        await db.addRestockOrder(order);
        return res.status(201).end(); 

    
    }catch(err){
        res.status(500).end();
    }
 
}); 

//PUT /api/restockOrder/:id
router.put('/api/restockOrder/:id', async (req,res)=> {
    try {
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const id = req.params.id
        const newState = req.body.newState

        let count = await db.checkIfStored(id);
        if (count == 0) {
            return res.status(404).json({error: `No restock order associated to id`});
        }

        //Update Restock Order
        await db.updateRestockOrder(newState, id);
        return res.status(200).end();
    } catch (err) {
        res.status(503).end();
    }
});

//PUT /api/restockOrder/:id/skuItems


//PUT /api/restockOrder/:id/transportNote


//DELETE /api/restockOrder/:id
router.delete('/api/restockOrder/:id', async (req,res)=>{
    try{
        const id = req.params.id
        
        let count = await db.checkIfStored(id);
        if (count == 0){
            return res.status(422).json({error: `Provided ID is invalid`});
        }

        //Delete Restock Order
        await db.deleteRestockOrder(id);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 


module.exports = router
