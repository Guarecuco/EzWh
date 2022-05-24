const express = require("express");
const TestDescriptorDAO = require('../dao/TestDescriptorDAO.js')
const db = new TestDescriptorDAO('EzWh.db')

const router = express.Router()
router.use(express.json());


//GET

router.get('/api/testDescriptors', async (req,res)=>{
    
    try{
        const tests = await db.getTestsDescriptors();
      
        return res.status(200).json(tests);
        
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  router.get('/api/testDescriptors/:id', async (req,res)=>{
    try{
            let count = await db.findTestId(req.params.id);
            if (count == 0){
            
            return res.status(404).end(); 
            }   
            const test = await db.getTestDescriptor(req.params.id);
            return res.status(200).json(test);
        
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  //POST
  router.post('/api/testDescriptor', async (req,res)=>{ //check if  idsku exist
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
      
      await db.newTableTests();
      //Check if test exists
      let count = await db.findTestName(newTest.name);
      if (count == 0){
        await db.addTest(newTest);
        return res.status(201).end(); 
      }   
      return res.status(422).json({error: `Test name already exists`});
      
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
        
        let count = await db.findTestId(test.nid);
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
        let count = await db.findTestId(test.nid);
        if (count == 0){
            return res.status(422).end();
        }

        //Delete test
        await db.deleteTest(test.nid);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

}); 


router.delete('/testDescriptor/deleteAll', async (req,res)=>{
    try{
        //Delete All Tests
        await db.deleteAllTests();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

});

//droptable
router.delete('/testDescriptor/dropTable', async (req,res)=>{
    try{
        await db.dropTestsTable();
        await db.newTableTests();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

});
module.exports = router