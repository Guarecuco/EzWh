const express = require("express");
const SkuDAO = require('../dao/SkuDAO.js')
const db = new SkuDAO('EzWh')
const PositionDAO = require('../dao/PositionDAO.js');
const dbP = new PositionDAO('EzWh');

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

router.get('/api/skus/:id', async (req,res)=>{
  try{
    const id=req.params.id;
    if(!id){
      return res.status(422).json({error: `Invalid id`});
    }
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

router.post('/api/sku', async (req,res)=>{
  try{
    //Check if body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    let sku = req.body;
      //Check if any field is empty, notes can be
    if (!( sku && sku.description && sku.weight && sku.volume && sku.notes && sku.price && sku.availableQuantity!==undefined )) {
      return res.status(422).json({error: `Invalid sku data`});
    }
    await db.newTableSku();

    await db.storeSku(sku);

    return res.status(201).end();
  }
  catch(err){
      res.status(503).end();
  }
});

router.put('/api/sku/:id', async (req,res)=>{
  try{
    //Check if body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    const sku = req.body;
    const id=req.params.id;
    //Check if any field is empty, notes can be
    if (!( id && sku && sku.newDescription && sku.newWeight && sku.newVolume && sku.newNotes && sku.newPrice && sku.newAvailableQuantity!==undefined )) {
      return res.status(422).json({error: `Invalid sku data`});
    }
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

router.put('/api/sku/:id/position', async (req,res)=>{
  try{
    //Check if body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    const item = req.body;
    const id=req.params.id;
    //Check if any field is empty, notes can be
    if (!( id && item && item.position )) {
      return res.status(422).json({error: `Invalid sku data`});
    }
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

router.delete('/api/skus/:id', async (req,res)=>{
  try{
      const id=req.params.id
      if (!id) {
          return res.status(422).json({error: `Invalid id`});
      }
      let get = await db.getSku(id);
      if (get<=0){
          return res.status(422).json({error: `no sku associated to id`});
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

module.exports = router