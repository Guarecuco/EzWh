const express = require("express");
const InternalOrderDAO = require('../dao/InternalOrderDAO.js')
const db = new InternalOrderDAO('EzWh')

const router = express.Router()
router.use(express.json());

//Regular expression to check date. Format : yyyy/mm/dd hh:mm
const date_regex = /^(19|20)\d{2}\/([1-9]|1[0-2])\/([1-9]|1\d|2\d|3[01]) (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|)$/;

//GET /api/internalOrders
router.get('/api/internalOrders', async (req,res)=>{
    try{
        //Get all internal orders
        let orders = await db.getInternalOrders();

        //For each order, get array of all products
        for (var i=0; i<orders.length; i++){
            if (orders[i].state !== "COMPLETED"){
                //If order is not COMPLETED, return SKUid, description, price, qty
                var product = await db.getInternalOrdersProducts(orders[i]);
            }
            else{
                //If order is COMPLETED, return SKUid, description, price, RFID
                var product = await db.getInternalOrdersProductsCompleted(orders[i]);
            }
            orders[i].products = product;
        }
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    } 
});

//GET /api/internalOrdersIssued
router.get('/api/internalOrdersIssued', async (req,res)=>{
    try{
        //Get all internal orders in ISSUED state
        let orders = await db.getInternalOrdersByState("ISSUED");
        //For each order, return array of products
        for (var i=0; i<orders.length; i++){
            var product = await db.getInternalOrdersProducts(orders[i]);
            orders[i].products = product;
        }
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    }
}); 

//GET /api/internalOrdersAccepted
router.get('/api/internalOrdersAccepted', async (req,res)=>{
    try{
        //Get all internal orders in ACCEPTED state
        let orders = await db.getInternalOrdersByState("ACCEPTED");

        //For each order, return array of products
        for (var i=0; i<orders.length; i++){
            var product = await db.getInternalOrdersProducts(orders[i]);
            orders[i].products = product;
        }
        return res.status(200).json(orders);
    }
    catch(err){
        res.status(500).end();
    }
  
}); 


//GET /api/internalOrders/:id
router.get('/api/internalOrders/:id', async (req,res)=>{
    try{
        var order = {
            orderId : req.params.id
        }
        //Check if orderId exist
        let count = await db.checkIfOrderExists(order);
        if (count == 0){
            return res.status(404).end();
        }

        //Get order using orderId
        var order = await db.getInternalOrdersbyID(order);
        //Get array or products
        if (order[0].state !== "COMPLETED"){
            //If order is not COMPLETED, return SKUid, description, price, qty
            var product = await db.getInternalOrdersProducts(order[0]);
        }
        else{
            //If order is COMPLETED, return SKUid, description, price, RFID
            var product = await db.getInternalOrdersProductsCompleted(order[0]);
        }
        order[0].products = product;

        return res.status(200).json(order[0]);
    }
    catch(err){
        res.status(500).end();
    } 
});

//POST /api/internalOrders
router.post('/api/internalOrders', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        let order = req.body;
        //Check if any field is empty
        if (order === undefined || order.issueDate === undefined || order.products === undefined ||  
            order.customerId === undefined || order.issueDate == '' || order.products == '' || 
            order.customerId == '' ) {
                return res.status(422).json({error: `Invalid data`});
        }

        for (var i=0; i<order.products.length; i++){
            //Check product array is not empty
            if (order.products[i].SKUId === undefined || order.products[i].description === undefined || 
                order.products[i].price === undefined || order.products[i].qty === undefined ||
                order.products[i].SKUId == '' || order.products[i].description == '' || 
                order.products[i].price == '' || order.products[i].qty == '' ) {
                    return res.status(422).json({error: `Empty product field`});
            }
            //Check if product's SKUI and qty are integer
            if(!Number.isInteger(order.products[i].SKUId) || !Number.isInteger(order.products[i].qty)){
                return res.status(422).json({error: `Invalid data`});
            }
            //Check if price is number
            if(isNaN(order.products[i].price)){
                return res.status(422).json({error: `Price is not a number`});
            }
        }

        //Check date format
        if(!(date_regex.test(order.issueDate))){
            return res.status(422).json({error: `Invalid date`});
        }

        //Creata table if doesn't exist
        await db.newTableInternalOrders();
        await db.newTableInternalOrdersProducts();
        order.state = "ISSUED";
        //Store order in DB
        order.orderId = await db.storeInternalOrder(order);
        for (var i=0; i<order.products.length; i++){
            let product = {
                SKUId : order.products[i].SKUId,
                description: order.products[i].description,
                price: order.products[i].price,
                qty: order.products[i].qty,
                orderId : order.orderId
            }
            //Store products in DB
            await db.storeInternalOrderProducts(product);
        }
        return res.status(200).end();
    }
    catch(err){
        res.status(500).end();
    }
}); 

//PUT /api/internalOrders/:id
router.put('/api/internalOrders/:id', async (req,res)=>{
    try{
         //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }    
        let order = req.body;
        order.orderId = req.params.id;

        //Check if state is valid
        if (order.newState !== 'ISSUED' && order.newState !== 'ACCEPTED' && order.newState !== 'REFUSED' && 
            order.newState !== 'CANCELED' && order.newState !== 'COMPLETED') {
                return res.status(422).json({error: `Invalid state`});
        }

        //Check if orderId exist
        let count = await db.checkIfOrderExists(order);
        if (count == 0){
            return res.status(404).end();
        }

        if (order.newState == 'COMPLETED'){
            //Check product array is not empty
            if(order.products === undefined || order.products == ''){
                return res.status(422).json({error: `Invalid body request`});  
            }

            for (var i=0; i<order.products.length; i++){
                //Check product array is not empty
                if (order.products[i].SKUId === undefined || order.products[i].RFID === undefined || 
                    order.products[i].SKUId == '' || order.products[i].RFID == '' ) {
                        return res.status(422).json({error: `Empty product field`});
                }
                //Check if product's SKUI is integer
                if(!Number.isInteger(order.products[i].SKUId)){
                    return res.status(422).json({error: `Invalid data`});
                }
            }
        }
              
        //Update order state
        await db.updateInternalOrder(order);

        //Update products if state is COMPLETED
        if (order.newState == 'COMPLETED'){
           
            for (var i=0; i<order.products.length; i++){
                let product = {
                    SKUId : order.products[i].SKUId,
                    RFID : order.products[i].RFID,
                    orderId: order.orderId
                }
                await db.updateInternalOrderProducts(product);
            }         
        }   
        return res.status(200).end();
    }
    catch(err){
        res.status(503).end();
    }
}); 

//DELETE /api/internalOrders/:id
router.delete('/api/internalOrders/:id', async (req,res)=>{
    try{ 
        let order = {
            orderId : req.params.id
        }

        //Check if orderId exist
        let count = await db.checkIfOrderExists(order);
        console.log(count);
        if (count == 0){
            return res.status(422).end();
        }

        //Delete
        await db.deleteInternalOrder(order); 
        await db.deleteInternalOrderProducts(order);     
        return res.status(200).end();
    }
    catch(err){
        res.status(503).end();
    }
}); 

module.exports = router;