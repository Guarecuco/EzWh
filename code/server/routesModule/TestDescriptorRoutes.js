const express = require("express");
const TestDescriptorDAO = require('../dao/TestDescriptorDAO.js')
const db = new TestDescriptorDAO('EzWh')

const router = express.Router()
router.use(express.json());


//GET
router.get('/api/testDescriptors', (req,res)=>{
    try{
        const tests = await db.getTestsDescriptors();
            return res.status(200).json(tests);
        
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  router.get('/api/testDescriptors/:id', (req,res)=>{
    try{
        if (/*test se manager o quality emp*/'')
        {
            const tests = await db.getTestDescriptor(req.body);
            return res.status(200).json(tests);
        }
        else
            return res.status(401).end();
    }
    catch(err){
        res.status(500).end();
    }
  }); 


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