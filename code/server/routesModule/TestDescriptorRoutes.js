const express = require("express");
const UserDAO = require('../dao/TestDescriptorDAO.js')
const db = new TestDescriptorDAO('EzWh')

const router = express.Router()

router.get('/api/testDescriptors', (req,res)=>{
    try{
        if (/*test se manager o quality emp*/'')
        {
            const tests = await db.getTestsDescriptors();
            return res.status(200).json(tests);
        }
        else
            return res.status(401).end();
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

module.exports = router