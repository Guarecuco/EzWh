const express = require("express");
const ItemDAO = require('../dao/ItemDAO.js')
const db = new ItemDAO('EzWh')

const router = express.Router()


//GET
router.get('/api/items', (req,res)=>{
    try{
        if (/*test se manager o quality emp*/'')
        {
            const items = await db.getItems();
            return res.status(200).json(items);
        }
        else
            return res.status(401).end();
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  router.get('/api/items/:id', (req,res)=>{
    try{
        if (/*test se manager o quality emp*/'')
        {
            const item = await db.getItem(req.params.id);
            return res.status(200).json(item);
        }
        else
            return res.status(401).end();
    }
    catch(err){
        res.status(500).end();
    }
  }); 

//-------------------
  //POST
  router.post('/api/testDescriptor', async (req,res)=>{
    try{
      //Check if body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: `Empty body request`});
      }
      let newTest = req.body;
        //Check if any field is empty
      if (!( newTest && newTest.name && newTest.procedureDescription && newTest.idSKU )) {
        return res.status(422).json({error: `Invalid test descriptor data`});
      }
      //TODO: check existance of test
      await db.newTableTests();
      //Check if test exists
      let count = await db.findTestName(newTest.name);
      if (count == 0){
        await db.addTest(newTest);
        return res.status(201).end(); 
      }   
      return res.status(503).json({error: `Test name already exists`});
    }
    catch(err){
        res.status(503).end();
    }
});


//PUT
router.put('/api/testDescriptor/:id', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const test = {
            nid: req.params.id,
            nname : req.body.newName,
            ndescr : req.body.newProcedureDescription,
            nsku : req.body.newIdSKU
        }

        //Check if test exist
        let count = await db.findTestId(nid);
        if (count == 0){
            return res.status(404).end();
        }
        //Update test
        await db.updateTest(test);   
        return res.status(200).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 

//DELETE
router.delete('/api/testDescriptor/:id', async (req,res)=>{
    try{
        const test = {nid: req.params.id}

        //Check if test exist
        let count = await db.findTestId(nid);
        if (count == 0){
            return res.status(404).end();
        }

        //Delete test
        await db.deleteTest(nid);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 

module.exports = router