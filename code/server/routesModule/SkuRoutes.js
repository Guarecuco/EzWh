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
    if (!( sku && sku.description && sku.weight && sku.volume && sku.price && sku.availableQuantity!==undefined )) {
      return res.status(422).json({error: `Invalid sku data`});
    }
    await db.newTableSku();
    //Check if sku exist
    let count = await db.checkIfStored(sku);
    if (count == 0){
      await db.storeSku(sku);
      return res.status(201).end(); 
    }   
    return res.status(503).json({error: `SKU already exists`});
  }
  catch(err){
      res.status(503).end();
  }
});

module.exports = router