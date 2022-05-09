const express = require("express");
const SkuDAO = require('../dao/SkuDAO.js')
const db = new SkuDAO('EzWh')

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
    return res.status(200).json(sku);
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

    return res.status(200).end();
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
    let count = await db.checkIfStored(id);
    if (count != 0){
      await db.updateSku(id,sku);
      return res.status(200).end();
    }   
    return res.status(503).json({error: `SKU does not exists`});
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
    let count = await db.checkIfStored(id);
    console.log(count);
    if (count != 0){
      await db.updatePositionSku(id,item.position);
      return res.status(200).end();
    }   
    return res.status(503).json({error: `SKU does not exists`});
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
      let count = await db.checkIfStored(id);
      if (count==0){
          return res.status(422).json({error: `no sku associated to id`});
      }
      await db.deleteSku(id);
      return res.status(204).end();
  }
  catch(err){
    res.status(503).end();
  }
});

module.exports = router