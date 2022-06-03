const express = require("express");
const SkuDAO = require('../dao/SkuDAO.js')
const db = new SkuDAO('EzWh.db')
const PositionDAO = require('../dao/PositionDAO.js');
const dbP = new PositionDAO('EzWh.db');
const {check, validationResult} = require('express-validator'); // validation middleware

const router = express.Router()
router.use(express.json());

router.get('/api/skus', async (req,res)=>{
  try{
    const skus = await db.getStoredSkus();
    return res.status(200).json(skus);
  }
  catch(err){
    res.status(500).end();
  }
});

router.get('/api/skus/:id',[
  check("id").isInt( {min:1} ),
], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const id=req.params.id;
    const sku = await db.getSku(id);
    if(sku.length <= 0){
      return res.status(404).json({error: `Sku not found`});
    }
    return res.status(200).json(sku[0]);
  }
  catch(err){
    res.status(500).end();
  }
});

router.post('/api/sku',[
  check("description").isLength({ min: 1 }),
  check("weight").isInt( {min:1} ),
  check("volume").isInt( {min:1} ),
  check("notes").isLength({ min: 1 }),
  check("availableQuantity").isInt( {min:0} ),
  check("price").isFloat( {gt:0} ),
], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    let sku = req.body;
    await db.newTableSku();

    await db.storeSku(sku);

    return res.status(201).end();
  }
  catch(err){
      res.status(503).end();
  }
});

router.put('/api/sku/:id',[
  check("id").isInt( {min:1} ),
  check("newDescription").isLength({ min: 1 }),
  check("newWeight").isInt( {min:1} ),
  check("newVolume").isInt( {min:1} ),
  check("newNotes").isLength({ min: 1 }),
  check("newAvailableQuantity").isInt( {min:0} ),
  check("newPrice").isFloat( {gt:0} ),
], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const sku = req.body;
    const id=req.params.id;
    //Check if sku exist
    let get = await db.getSku(id);
    if (get.length <= 0){
      return res.status(404).json({error: `SKU does not exists`});
    }
    try{
      let oldSku = get[0];
      
      if( oldSku && oldSku.position){
        let pos = (await dbP.getPosition(oldSku.position))[0];
        await dbP.updateDimensions(sku.newVolume,sku.newWeight,sku.newAvailableQuantity,pos);
      }
    }
    catch(err){
      return res.status(422).json({error: `Unable to Update position:`+err});
    }
    await db.updateSku(id,sku);
    return res.status(200).end();
  }
  catch(err){
      res.status(503).end();
  }
});

router.put('/api/sku/:id/position',[
  check("id").isInt( {min:1} ),
  check("position").isLength({ min: 12, max: 12 }).isInt(),
], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const item = req.body;
    const id=req.params.id;
    //Check if sku exist
    let get = await db.getSku(id);
    if (get <= 0){
      return res.status(404).json({error: `SKU does not exists`});
    }
    let sku = get[0];
    get = await dbP.getPosition(item.position);
    if (get <= 0){
      return res.status(404).json({error: `Position does not exists`});
    }
    let pos = get[0];
    try{
      await dbP.updateDimensions(sku.volume,sku.weight,sku.availableQuantity,pos);
    }
    catch(err){
      return res.status(422).json({error: `Unable to Update position:`+err});
    }
    await db.setPosition(id,item.position);
    return res.status(200).end();
  }
  catch(err){
      res.status(503).end();
  }
});

router.delete('/api/skus/:id',[
  check("id").isInt( {min:1} ),
], async (req,res)=>{
  try{
    const id = req.params.id;
    if (id<0){
      return res.status(422).json({errors: errors.array()});
    }
    let get = await db.getSku(id);
    if (get<=0){
      //return 204 even if doest exist
      return res.status(204).end();
    }
    await db.deleteSku(id);
    return res.status(204).end();
  }
  catch(err){
    res.status(503).end();
  }
});

//for testing only
router.delete('/api/skus/', async (req,res)=>{
  try{
    await db.deleteAllSkus();
    await db.newTableSku();
    return res.status(204).end();
  }
  catch(err){
    res.status(503).send(err);
  }
});

function skuStartup () {
  try{
      //Droping table
      db.deleteAllSkus();
      //Creating table
      db.newTableSku();
  }
  catch(err){
      console.log(err);
  }
}
skuStartup();

module.exports = router