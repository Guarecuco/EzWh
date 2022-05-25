const express = require("express");
const SkuitemDAO = require('../dao/SkuitemDAO.js')
const db = new SkuitemDAO('EzWh.db')
const SkuDAO = require('../dao/SkuDAO.js')
const dbS = new SkuDAO('EzWh.db')

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
      if(skuitems.length <= 0){
        return res.status(404).json({error: `sku not found`});
      }
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
      const skuitem = await db.getStoredSkuitem(rfid);
      if (skuitem.length<=0){
        return res.status(404).json({error: `no skuitem associated to rfid`});
      }
      return res.status(200).json(skuitem[0]);
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
      if (!( item && item.RFID && item.SKUId !== undefined && item.DateOfStock && item.RFID.length==32 
        && item.DateOfStock.match(/^([1-9]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])[\ ]([01]?[0-9]|2[0-3]):[0-5][0-9])$/)!=null )) {
        return res.status(422).json({error: `Invalid skuitem data`});
      }
      //TODO: check existance of SKU
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

router.put('/api/skuitems/:rfid', async (req,res)=>{
    try{
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const rfid=req.params.rfid;
        const item=req.body;
        if (!( rfid && item && item.newRFID && item.newAvailable !== undefined && item.newDateOfStock && item.newRFID.length==32
          && item.newDateOfStock.match(/^([1-9]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])[\ ]([01]?[0-9]|2[0-3]):[0-5][0-9])$/)!=null)) {
            return res.status(422).json({error: `Invalid skuitem data`});
        }

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

router.delete('/api/skuitems/:rfid', async (req,res)=>{
    try{
        const rfid=req.params.rfid
        if (!rfid) {
            return res.status(422).json({error: `Invalid rfid`});
        }
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

async function skuitemStartup () {
  try{
      //Droping table
      await db.deleteSkuitems();
      //Creating table
      await db.newTableSkuitem();
      //Encrypt password
  }
  catch(err){
      console.log(err);
  }

}
skuitemStartup();

module.exports = router