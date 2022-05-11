const express = require("express");
const RestockOrderDAO = require('../dao/RestockOrderDAO.js')
const TestResultDAO = require('../dao/TestResultDAO.js')
const db = new RestockOrderDAO('EzWh')
const testdb = new TestResultDAO('EzWh')

const router = express.Router()
router.use(express.json());

//GET /api/restockOrders
router.get('/api/restockOrders', async (req,res)=>{
    try{
        const orders = await db.getAllRestockOrders()
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

//GET /api/restockOrders/:id
router.get('/api/restockOrders/:id', async (req,res)=>{
    try{
        if (req.params.id === undefined || !Number.isInteger(+req.params.id))
            return res.status(422).json({error: `Unprocessable Entity`})

        const order = await db.getRestockOrder(req.params.id);
        if (order === undefined)
            return res.status(404).json({error: `No restock order associated to id`})
        return res.status(200).json(order);
    }
    catch(err){
        res.status(500).end();
    }
  
});

//GET /api/restockOrders/:id/returnItems
router.get('/api/restockOrders/:id/returnItems', async (req,res)=>{
    try{
        if (req.params.id === undefined || !Number.isInteger(+(req.params.id)))
            return res.status(422).json({error: `Unprocessable Entity`})

        const order = await db.getRestockOrder(req.params.id);
        if (order === undefined)
            return res.status(404).json({error: `No restock order associated to id`})

        let returnable = []
        /*
        for (let item of order.skuItems){
            const count = await testdb.countFailedTest(item.rfid)
            if (count > 0 )
                returnable.push(item)
        }
        */


        //let items = await db.getReturnableItems(order.skuItems);
        return res.status(200).json(returnable);
    }
    catch(err){
        res.status(500).end();
    }
  
});

//POST /api/restockOrder
router.post('/api/restockOrder', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        let order = req.body;
          //Check if any field is empty
        if (order === undefined || order.issueDate === undefined ||
            order.supplierId === undefined || order.products === undefined) {
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
        if(!Number.isInteger(+req.params.id))
            return res.status(422).json({error: `Provided ID is invalid`});

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
router.put('/api/restockOrder/:id/skuItems', async (req,res)=> {
    try {
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const id = req.params.id
        if(!Number.isInteger(+req.params.id))
            return res.status(422).json({error: `Provided ID is invalid`});
        const newSkuItems = req.body.skuItems

        let order = await db.getRestockOrder(id);
        if (order === undefined) {
            return res.status(404).json({error: `No restock order associated to id`});
        }
        if (order.state !== 'DELIVERED')
            return res.status(422).json({error: `Order state is not DELIVERED`});

        let finalSkuItems = []
        if (order.skuItems.length === 0 || order.skuItems === undefined )
            finalSkuItems = newSkuItems
        else{
            finalSkuItems = [...newSkuItems]
            for (let item of order.skuItems){
                finalSkuItems.push(item)
            }
        }
        //Update Restock Order
        await db.updateRestockOrderSKUItems(finalSkuItems, order.id);
        return res.status(200).end();
    } catch (err) {
        res.status(503).end();
    }
});


//PUT /api/restockOrder/:id/transportNote
router.put('/api/restockOrder/:id/transportNote', async (req,res)=> {
    try {
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const id = req.params.id
        if(!Number.isInteger(+req.params.id))
            return res.status(422).json({error: `Provided ID is invalid`});
        const transportNote = req.body.transportNote
        const deliveryDate = transportNote.deliveryDate

        let order = await db.getRestockOrder(id);
        if (order === undefined) {
            return res.status(404).json({error: `No restock order associated to id`});
        }
        if (order.state !== 'DELIVERY')
            return res.status(422).json({error: `Order state is not DELIVERY`});
        if(Date.parse(deliveryDate) < Date.parse(order.issueDate))
            return res.status(422).json({error: `Delivery date is before issue date`});

        //Update Restock Order
        await db.updateRestockOrderTransportNote(transportNote, order.id);
        return res.status(200).end();
    } catch (err) {
        res.status(503).end();
    }
});

//DELETE /api/restockOrder/:id
router.delete('/api/restockOrder/:id', async (req,res)=>{
    try{
        const id = req.params.id
        if(!Number.isInteger(+req.params.id))
            return res.status(422).json({error: `Provided ID is invalid`});

        //Delete Restock Order
        await db.deleteRestockOrder(id);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 


module.exports = router
