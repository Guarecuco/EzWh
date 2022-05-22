const express = require("express");
const TestResultDAO = require('../dao/TestResultDAO.js')
const db = new TestResultDAO('EzWh')
const TestDescriptorDAO = require('../dao/TestDescriptorDAO.js')
const dbT = new TestDescriptorDAO('EzWh')
const router = express.Router()
router.use(express.json());


//GET
router.get('/api/skuitems/:rfid/testResults', async (req,res)=>{
    try{
        const results = await db.getSKUResults(req.params.rfid);
        return res.status(200).json(results);
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  router.get('/api/skuitems/:rfid/testResults/:id', async (req,res)=>{
    try{
        
            const results = await db.getSKUResult(req.params);
            return res.status(200).json(results);
        
    }
    catch(err){
        res.status(500).end();
    }
  }); 


  //POST
  router.post('/api/skuitems/testResult', async (req,res)=>{
    try{
      //Check if body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: `Empty body request`});
      }
      let newResult = req.body;
        //Check if any field is empty
      if (!( newResult && newResult.rfid && newResult.idTestDescriptor && newResult.Date )) {
        return res.status(422).json({error: `Invalid test result data`});
      }

      await db.newResultTests();
      //Check if test exists
      let count = await dbT.findTestId(newResult.idTestDescriptor);
      if (count > 0){
        await db.addResult(newResult);
        return res.status(201).end(); 
      }   
      return res.status(404).json({error: `Test does not exists`});
    }
    catch(err){
        res.status(503).end();
    }
});


//PUT
router.put('/api/skuitems/:rfid/testResult/:id', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const eresult = {
            rfid : req.params.rfid,
            id: req.params.id,
            etest: req.body.newIdTestDescriptor,
            edate : req.body.newDate,
            eresult : req.body.newResult
            
        }

        //Check if test exist
        let count = await dbT.findTestId(eresult.etest);
        if (count > 0){
            
            let tests = await db.getSKUResult(eresult);
           
            if(tests)
            {
                await db.updateResult(eresult);
                return res.status(200).end();
            }
            
            return res.status(404).json({error: `Test does not exists`});
        }   
        return res.status(404).json({error: `New test does not exists`});
      }
    catch(err){
        res.status(503).end();
    }

}); 

//DELETE
router.delete('/api/skuitems/:rfid/testResult/:id', async (req,res)=>{
    try{
        //Check if test exist
        const eresult = {
            rfid : req.params.rfid,
            id: req.params.id
        }
            let tests = await db.getSKUResult(eresult);
            if(tests)
            {
                await db.deleteResult(eresult);
                return res.status(204).end();
            }
            
            return res.status(404).json({error: `Test does not exists`});
    }
    catch(err){
        res.status(503).end();
    }

}); 

//DELETE
router.delete('/skuItems/deleteAll', async (req,res)=>{
    try{
        //Delete All Tests
        await db.deleteAllResults();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

});

//droptable
router.delete('/skuItems/dropTable', async (req,res)=>{
    try{
        await db.dropResultsTable();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
    }

});
module.exports = router