const express = require("express");
const UserDAO = require('../dao/UserDAO.js')
const db = new UserDAO('EzWh')

const router = express.Router()

router.get('/api/users', async (req,res)=>{
    try{
        const users = await db.getStoredUsers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).end();
    }
    
  }); 

module.exports = router