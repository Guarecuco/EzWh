const express = require("express");
const SkuitemDAO = require('../dao/SkuitemDAO.js')
const db = new SkuitemDAO('EzWh')

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

router.get('/api/skuitems/sku/:id', async (req,res)=>{
    try{
      const SKUId=req.params.id;
      if(!SKUId){
        return res.status(422).json({error: `Invalid SKUId`});
      }
      const skuitems = await db.getAvailableSkuitems(SKUId);
      //zero check
      return res.status(200).json(skuitems);
    }
    catch(err){
      res.status(500).end();
    }
});

router.get('/api/skuitems/:rfid', async (req,res)=>{
    try{
      const rfid=req.params.rfid;
      if(!rfid){
        return res.status(422).json({error: `Invalid rfid`});
      }
      let count = await db.checkIfStored(rfid);
      if (count==0){
        return res.status(404).json({error: `no skuitem associated to rfid`});
      }
      const skuitem = await db.getStoredSkuitem(rfid);
      return res.status(200).json(skuitem);
    }
    catch(err){
      res.status(500).end();
    }
});

router.post('/api/skuitem', async (req,res)=>{
    try{
      //Check if body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: `Empty body request`});
      }
      let item = req.body;
        //Check if any field is empty
      if (!( item && item.RFID && item.SKUId !== undefined && item.DateOfStock )) {
        return res.status(422).json({error: `Invalid skuitem data`});
      }
      //TODO: check existance of SKU
      await db.newTableSkuitem();
      //Check if Skuitem exists
      let count = await db.checkIfStored(item.RFID);
      if (count == 0){
        await db.storeSkuitem(item);
        return res.status(201).end(); 
      }   
      return res.status(503).json({error: `Skuitem already exists`});
    }
    catch(err){
        res.status(503).end();
    }
});

router.put('/api/skuitems/:rfid', async (req,res)=>{
    try{
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const rfid=req.params.rfid;
        const item=req.body;
        if (!( rfid && item && item.newRFID && item.newAvailable !== undefined && item.newDateOfStock)) {
            return res.status(422).json({error: `Invalid skuitem data`});
        }

        let count = await db.checkIfStored(rfid);
        if (count==0){
            return res.status(404).json({error: `no skuitem associated to rfid`});
        }
        await db.updateSkuitem(rfid,item);
        return res.status(200).end(); 
    }
    catch(err){
      res.status(503).end();
    }
});

router.delete('/api/skuitems/:rfid', async (req,res)=>{
    try{
        const rfid=req.params.rfid
        if (!rfid) {
            return res.status(422).json({error: `Invalid rfid`});
        }
        let count = await db.checkIfStored(rfid);
        if (count==0){
            return res.status(422).json({error: `no skuitem associated to rfid`});
        }
        await db.deleteSkuitem(rfid);
        return res.status(204).end();
    }
    catch(err){
      res.status(503).end();
    }
});

module.exports = router