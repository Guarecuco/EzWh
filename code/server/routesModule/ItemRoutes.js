const express = require("express");
const ItemDAO = require('../dao/ItemDAO.js')
const db = new ItemDAO('EzWh')

const SKUDAO = require('../dao/SkuDAO.js')
const dbSKU = new SKUDAO('EzWh')

const router = express.Router()
router.use(express.json());


//GET
router.get('/api/items', async (req,res)=>{
    try{
         const items = await db.getItems();
            return res.status(200).json(items);
       
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  router.get('/api/items/:id', async (req,res)=>{
    try{
         const item = await db.getItem(req.params.id);
            return res.status(200).json(item);
        
    }
    catch(err){
        res.status(500).end();
    }
  }); 

  //POST
  router.post('/api/item', async (req,res)=>{
    try{
      //Check if body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: `Empty body request`});
      }
      let newItem = req.body;
        //Check if any field is empty
      if (!( newItem )) {
        return res.status(422).json({error: `Invalid item data`});
      }

      await db.newTableItems();
      //TODO Check if sku exists
      //let sku = await dbSKU.getSKU(newItem.SKUId);
     // if (sku){
        await db.addItem(newItem);
        return res.status(201).end(); 
     // }   
      return res.status(500).json({error: `SKU does not exists`});
    }
    catch(err){
        res.status(500).end();
    }
});


//PUT
router.put('/api/item/:id', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const item = {
            nid: req.params.id,
            ndescr : req.body.newDescription,
            nprice : req.body.newPrice,
        }

        //Check if item exist
        let count = await db.getItem(item.nid);
        if (!count){
            return res.status(404).end();
        }
        //Update test
        await db.updateItem(item);   
        return res.status(200).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 

//DELETE
router.delete('/api/items/:id', async (req,res)=>{
    try{
        let nid= req.params.id;

        //Check if test exist
        let count = await db.getItem(nid);
        if (!count){
            return res.status(404).end();
        }

        //Delete test
        await db.deleteItem(nid);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 

module.exports = router