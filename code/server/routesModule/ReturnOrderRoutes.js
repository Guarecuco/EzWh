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

module.exports = router