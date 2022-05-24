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

        //Check if item exist
        
        let count = await db.countItems(req.params.id);
        if (count == 0){
            return res.status(404).end();
        }
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
        if (!( newItem && newItem.description && newItem.price && newItem.price>=0 && newItem.SKUId && newItem.supplierId )) {
            return res.status(422).json({error: `Invalid item data`});
          }
    
          await db.newTableItems();
          //Check if sku exist
            
          let count = await dbSKU.countSku(newItem.SKUId);
          if (count == 0){
                  
            return res.status(404).json({error: `SKU not exist`});
            }
              await db.addItem(newItem);
        return res.status(201).end(); 
    
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
        let count = await db.countItems(item.nid);
        if (count===0){
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

//DELETE
router.delete('/items/deleteAll', async (req,res)=>{
    try{
        //Delete All Tests
        await db.deleteAllItems();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

});

//droptable
router.delete('/items/dropTable', async (req,res)=>{
    try{
        await db.dropItemsTable();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

});

module.exports = router