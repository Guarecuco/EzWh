const express = require("express");
const UserDAO = require('../dao/UserDAO.js');
const bcrypt = require('bcryptjs');
const db = new UserDAO('EzWh.db');

const router = express.Router();
router.use(express.json());

//GET /api/userinfo
router.get('/api/userinfo', async (req,res)=>{
    try{
        const users = await db.getLoggedUsers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 

//GET /api/suppliers
router.get('/api/suppliers', async (req,res)=>{
    try{
        const users = await db.getStoredSuppliers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    } 
}); 

//GET /api/users
router.get('/api/users', async (req,res)=>{
    try{
        const users = await db.getStoredUsersWithoutManagers();
        return res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 
  
//POST /api/newUser
router.post('/api/newUser', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `validation of request body failed or attempt to create manager or administrator accounts`});
          }
        let user = req.body;
          //Check if any field is empty
        if (user === undefined || user.name === undefined || user.surname === undefined ||  
            user.username === undefined || user.password === undefined || user.type === undefined || 
            user.name == '' || user.surname == '' || user.username == '' || user.password == '' || user.type == '') {
                return res.status(422).json({error: `validation of request body failed or attempt to create manager or administrator accounts`});
        }
        //Check type is correct
        if (user.type !== 'customer' && user.type !== 'qualityEmployee' && user.type !== 'clerk' && 
            user.type !== 'deliveryEmployee' && user.type !== 'supplier') {
            return res.status(422).json({error: `validation of request body failed or attempt to create manager or administrator accounts`});
        }

        //Check password if greater than 8 chars
        if (user.password.length < 8) {
            return res.status(422).json({error: `validation of request body failed or attempt to create manager or administrator accounts`});
        }

        //Create table if doesn't exist
        await db.newTableUsers();

        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){

            //Apply hash function to password with 5 rounds
            user.password = await bcrypt.hash(user.password, 5);
            //Store user with hashed password
            await db.storeUser(user);
            return res.status(201).end(); 
        }   
        return res.status(409).json({error: `user with same mail and type already exists`});
    }
    catch(err){
        res.status(503).json({error: `generic error`});
    }
}); 

//POST /api/managerSessions
router.post('/api/managerSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `generic error`});
        }
        let user = req.body;
        user.type = 'manager';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `generic error`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).json({error: `wrong username and/or password`});
        }
        //Check if password is the same as stored
        const validPassword = await bcrypt.compare(user.password,storedUser[0].password);
        if (validPassword){
            userinfo = {
                id : storedUser[0].id,
                username: storedUser[0].email,
                name: storedUser[0].name,
                //surname: storedUser[0].surname
            }
            //Flag as logged in
            await db.newTableLoggedUsers();
            await db.loginUser(storedUser[0]);
            //Return
            return res.status(200).json(userinfo); 
        }   
        return res.status(401).json({error: `wrong username and/or password`});
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 

//POST /api/customerSessions
router.post('/api/customerSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `generic error`});
        }
        let user = req.body;
        user.type = 'customer';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `generic error`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).json({error: `wrong username and/or password`});
        }
        //Check if password is the same as stored
        const validPassword = await bcrypt.compare(user.password,storedUser[0].password);
        if (validPassword){
            userinfo = {
                id : storedUser[0].id,
                username: storedUser[0].email,
                name: storedUser[0].name,
                //surname: storedUser[0].surname
            }
            //Flag as logged in
            await db.newTableLoggedUsers();
            await db.loginUser(storedUser[0]);
            //Return
            return res.status(200).json(userinfo); 
        }   
        return res.status(401).json({error: `wrong username and/or password`});
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 
    
//POST /api/supplierSessions
router.post('/api/supplierSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `generic error`});
        }
        let user = req.body;
        user.type = 'supplier';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `generic error`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).json({error: `wrong username and/or password`});
        }
        //Check if password is the same as stored
        const validPassword = await bcrypt.compare(user.password,storedUser[0].password);
        if (validPassword){
            userinfo = {
                id : storedUser[0].id,
                username: storedUser[0].email,
                name: storedUser[0].name,
                //surname: storedUser[0].surname
            }
            //Flag as logged in
            await db.newTableLoggedUsers();
            await db.loginUser(storedUser[0]);
            //Return
            return res.status(200).json(userinfo); 
        }   
        return res.status(401).json({error: `wrong username and/or password`});
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 

//POST /api/clerkSessions
router.post('/api/clerkSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `generic error`});
        }
        let user = req.body;
        user.type = 'clerk';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `generic error`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).json({error: `wrong username and/or password`});
        }
        //Check if password is the same as stored
        const validPassword = await bcrypt.compare(user.password,storedUser[0].password);
        if (validPassword){
            userinfo = {
                id : storedUser[0].id,
                username: storedUser[0].email,
                name: storedUser[0].name,
                //surname: storedUser[0].surname
            }
            //Flag as logged in
            await db.newTableLoggedUsers();
            await db.loginUser(storedUser[0]);
            //Return
            return res.status(200).json(userinfo); 
        }   
        return res.status(401).json({error: `wrong username and/or password`});
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }   
}); 

//POST /api/qualityEmployeeSessions
router.post('/api/qualityEmployeeSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `generic error`});
        }
        let user = req.body;
        user.type = 'qualityEmployee';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `generic error`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).json({error: `wrong username and/or password`});
        }
        //Check if password is the same as stored
        const validPassword = await bcrypt.compare(user.password,storedUser[0].password);
        if (validPassword){
            userinfo = {
                id : storedUser[0].id,
                username: storedUser[0].email,
                name: storedUser[0].name,
                //surname: storedUser[0].surname
            }
            //Flag as logged in
            await db.newTableLoggedUsers();
            await db.loginUser(storedUser[0]);
            //Return
            return res.status(200).json(userinfo); 
        }   
        return res.status(401).json({error: `wrong username and/or password`});
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 

//POST /api/deliveryEmployeeSessions
router.post('/api/deliveryEmployeeSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `generic error`});
        }
        let user = req.body;
        user.type = 'deliveryEmployee';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `generic error`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).json({error: `wrong username and/or password`});
        }
        //Check if password is the same as stored
        const validPassword = await bcrypt.compare(user.password,storedUser[0].password);
        if (validPassword){
            userinfo = {
                id : storedUser[0].id,
                username: storedUser[0].email,
                name: storedUser[0].name,
                //surname: storedUser[0].surname
            }
            //Flag as logged in
            await db.newTableLoggedUsers();
            await db.loginUser(storedUser[0]);
            //Return
            return res.status(200).json(userinfo); 
        }   
        return res.status(401).json({error: `wrong username and/or password`});
    }
    catch(err){
        res.status(500).json({error: `generic error`});
    }
}); 

//POST /api/logout
    //NOT to be implemented yet

//PUT /api/users/:username
router.put('/api/users/:username', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const user = {
            username : req.params.username,
            type : req.body.oldType,
            newType : req.body.newType
        }
        //Check if any field is empty
        if (user.username === undefined || user.type === undefined || user.newType === undefined ||
            user.username == '' || user.type == '' || user.newType == '') {
            return res.status(422).json({error: `validation of request body or of username failed or attempt to modify rights to administrator or manager`});
        }
        //Check new or old type is not manager
        if (user.type == 'manager' || user.newType == 'manager') {
            return res.status(422).json({error: `validation of request body or of username failed or attempt to modify rights to administrator or manager`});
        }
        //Check old type is correct
        if (user.type !== 'customer' && user.type !== 'qualityEmployee' && user.type !== 'clerk' && 
        user.type !== 'deliveryEmployee' && user.type !== 'supplier') {
            return res.status(404).json({error: `wrong username or oldType fields or user doesn't exists`});
        }
        //Check new type is correct
        if (user.newType !== 'customer' && user.newType !== 'qualityEmployee' && user.newType !== 'clerk' && 
        user.newType !== 'deliveryEmployee' && user.newType !== 'supplier') {
            return res.status(404).json({error: `vwrong username or oldType fields or user doesn't exists`});
        }
        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){
            return res.status(404).json({error: `wrong username or oldType fields or user doesn't exists`});
        }
        //Update user
        await db.updateUser(user);   
        return res.status(200).end();
    }
    catch(err){
        res.status(503).json({error: `generic error`});
    }
}); 

//DELETE /api/users/:username/:type
router.delete('/api/users/:username/:type', async (req,res)=>{
    try{
        const user = {
            username : req.params.username,
            type : req.params.type
        }
        //Check type is correct
        if (user.type !== 'customer' && user.type !== 'qualityEmployee' && user.type !== 'clerk' && 
        user.type !== 'deliveryEmployee' && user.type !== 'supplier') {
            return res.status(422).json({error: `validation of username or of type failed or attempt to delete a manager/administrator`});
        }
        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){
            return res.status(422).json({error: `validation of username or of type failed or attempt to delete a manager/administrator`});
        }
        //Delete user
        await db.deleteUser(user);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).json({error: `generic error`});
    }
}); 


//DELETE/api/users
//Drop users table, not part of official APIs
router.delete('/api/users', async (req,res)=>{
    try{
        await db.dropUsers();
        return res.status(204).end();
    }
    catch(err){
        res.status(503).json({error: `generic error`});
    }

});

//Internal API to create manager account
//POST /api/newManager
router.post('/api/newManager', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(422).end();
          }
        let user = req.body;
          //Check if any field is empty
        if (user === undefined || user.name === undefined || user.surname === undefined ||  
            user.username === undefined || user.password === undefined || user.type === undefined || 
            user.name == '' || user.surname == '' || user.username == '' || user.password == '' || user.type == '') {
                return res.status(422).end();
        }
        //Check type is correct
        if (user.type !== 'manager') {
            return res.status(422).end();
        }

        //Check password if greater than 8 chars
        if (user.password.length < 8) {
            return res.status(422).end();
        }

        //Create table if doesn't exist
        await db.newTableUsers();

        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){

            //Apply hash function to password with 5 rounds
            user.password = await bcrypt.hash(user.password, 5);
            //Store user with hashed password
            await db.storeUser(user);
            return res.status(201).end(); 
        }   
        return res.status(409).json({error: `user with same mail and type already exists`});
    }
    catch(err){
        res.status(503).json({error: `generic error`});
    }
}); 


module.exports = router;