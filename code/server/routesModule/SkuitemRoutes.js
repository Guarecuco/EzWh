const express = require("express");
const SkuitemDAO = require('../dao/SkuitemDAO.js')
const db = new SkuitemDAO('EzWh.db')
const SkuDAO = require('../dao/SkuDAO.js')
const dbS = new SkuDAO('EzWh.db')
const {isValid} = require("../utilities/dates");
const {check, validationResult} = require('express-validator'); // validation middleware

const router = express.Router()
router.use(express.json());

router.get('/api/skuitems', async (req,res)=>{
    try{
      const skuitems = await db.getStoredSkuitems();
      return res.status(200).json(skuitems);
    }
    catch(err){
      res.status(500).end();
    }
});

router.get('/api/skuitems/sku/:id',[
  check("id").isInt( {min:1} ),
], async (req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      const skuitems = await db.getAvailableSkuitems(req.params.id);
      if(skuitems.length <= 0){
        return res.status(404).json({error: `sku not found`});
      }
      return res.status(200).json(skuitems);
    }
    catch(err){
      res.status(500).end();
    }
});

router.get('/api/skuitems/:rfid',[
  check("rfid").isLength( {min:32, max:32} ),
], async (req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      const skuitem = await db.getStoredSkuitem(req.params.rfid);
      if (skuitem.length<=0){
        return res.status(404).json({error: `no skuitem associated to rfid`});
      }
      return res.status(200).json(skuitem[0]);
    }
    catch(err){
      res.status(500).end();
    }
});

router.post('/api/skuitem',[
  check("RFID").isLength( {min:32, max:32} ),
  check("SKUId").isInt( {min:1} ),
  check("DateOfStock").custom(d=>isValid(d)===true ? 1 : 0 )
], async (req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      let item = req.body;
      //check existance of SKU
      let sku = await dbS.getSku(item.SKUId);
      if (sku.length <= 0){
        return res.status(404).json({error: `SKU not found`});
      } 
      await db.newTableSkuitem();
      //Check if Skuitem exists
      let skuitem = await db.getStoredSkuitem(item.RFID);
      if (skuitem.length <= 0){
        await db.storeSkuitem(item);
        return res.status(201).end(); 
      }   
      return res.status(404).json({error: `Skuitem already exists`});
    }
    catch(err){
        res.status(503).end();
    }
});

router.put('/api/skuitems/:rfid',[
  check("rfid").isLength( {min:32, max:32} ),
  check("newRFID").isLength( {min:32, max:32} ),
  check("newAvailable").isInt( {min:0,max:1} ),
  check("newDateOfStock").custom(d=>isValid(d)===true ? 1 : 0 )
], async (req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      const rfid=req.params.rfid;
      const item=req.body;
      
      const skuitem = await db.getStoredSkuitem(rfid);
      if (skuitem.length<=0){
        return res.status(404).json({error: `no skuitem associated to rfid`});
      }
      await db.updateSkuitem(rfid,item);
      return res.status(200).end(); 
    }
    catch(err){
      res.status(503).end();
    }
});

router.delete('/api/skuitems/:rfid',[
  check("rfid").isLength( {min:32, max:32} ),
], async (req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      const rfid=req.params.rfid;
      const skuitem = await db.getStoredSkuitem(rfid);
      if (skuitem.length<=0){
        return res.status(422).json({error: `no skuitem associated to rfid`});
      }
      await db.deleteSkuitem(rfid);
      return res.status(204).end();
    }
    catch(err){
      res.status(503).end();
    }
});

router.delete('/api/skuitems', async (req,res)=>{
  try{
      await db.deleteSkuitems();
      await db.newTableSkuitem();
      return res.status(204).end();
  }
  catch(err){
    res.status(503).send(err);
  }
});

function skuitemStartup () {
  try{
      //Droping table
      db.deleteSkuitems();
      //Creating table
      db.newTableSkuitem();
  }
  catch(err){
      console.log(err);
  }

}
skuitemStartup();

module.exports = router