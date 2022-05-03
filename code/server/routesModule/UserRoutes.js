const express = require("express");
const UserDAO = require('../dao/UserDAO.js')
const db = new UserDAO('EzWh')

const router = express.Router()
router.use(express.json());

//GET /api/userinfo
router.get('/api/userinfo', async (req,res)=>{
    try{
        const users = await db.getLoggedUsers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).end();
    }
  
  }); 

//GET /api/suppliers
router.get('/api/suppliers', async (req,res)=>{
    try{
        const users = await db.getStoredSuppliers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).end();
    }
  
  }); 

//GET /api/users
router.get('/api/users', async (req,res)=>{
    try{
        const users = await db.getStoredUsersWithoutManagers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).end();
    }
    
  }); 
  
//POST /api/newUser
router.post('/api/newUser', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
          }
        let user = req.body;
          //Check if any field is empty
        if (user === undefined || user.name === undefined || user.surname === undefined ||  
            user.username === undefined || user.password === undefined || user.type === undefined || 
            user.name == '' || user.surname == '' || user.username == '' || user.password == '' || user.type == '') {
                return res.status(422).json({error: `Invalid user data`});
        }
        //Check type is correct
        if (user.type !== 'customer' && user.type !== 'qualityEmployee' && user.type !== 'clerk' && 
            user.type !== 'deliveryEmployee' && user.type !== 'supplier') {
            return res.status(422).json({error: `Invalid user data`});
        }
        await db.newTableUsers();

        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){
            db.storeUser(user);
            return res.status(201).end(); 
        }   
        return res.status(409).json({error: `User already exists`});
    }
    catch(err){
        res.status(500).end();
    }
 
  }); 

module.exports = router;