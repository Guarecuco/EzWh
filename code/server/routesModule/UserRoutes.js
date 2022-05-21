const express = require("express");
const UserDAO = require('../dao/UserDAO.js');
const bcrypt = require('bcryptjs');
const db = new UserDAO('EzWh');

const router = express.Router();
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
            return res.status(422).json({error: `Invalid type`});
        }

        //Check password if greater than 8 chars
        if (user.password.length < 8) {
            return res.status(422).json({error: `Invalid password length`});
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
        return res.status(409).json({error: `User already exists`});
    }
    catch(err){
        res.status(503).end();
    }
}); 

//POST /api/managerSessions
router.post('/api/managerSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `Empty body request`});
        }
        let user = req.body;
        user.type = 'manager';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `Invalid user data`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).end();
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
        return res.status(401).json({error: `Wrong username or password`});
    }
    catch(err){
        res.status(500).end();
    }
}); 

//POST /api/customerSessions
router.post('/api/customerSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `Empty body request`});
        }
        let user = req.body;
        user.type = 'customer';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `Invalid user data`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).end();
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
        return res.status(401).json({error: `Wrong username or password`});
    }
    catch(err){
        res.status(500).end();
    }
}); 
    
//POST /api/supplierSessions
router.post('/api/supplierSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `Empty body request`});
        }
        let user = req.body;
        user.type = 'supplier';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `Invalid user data`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).end();
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
        return res.status(401).json({error: `Wrong username or password`});
    }
    catch(err){
        res.status(500).end();
    }
}); 

//POST /api/clerkSessions
router.post('/api/clerkSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `Empty body request`});
        }
        let user = req.body;
        user.type = 'clerk';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `Invalid user data`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).end();
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
        return res.status(401).json({error: `Wrong username or password`});
    }
    catch(err){
        res.status(500).end();
    }   
}); 

//POST /api/qualityEmployeeSessions
router.post('/api/qualityEmployeeSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `Empty body request`});
        }
        let user = req.body;
        user.type = 'qualityEmployee';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `Invalid user data`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).end();
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
        return res.status(401).json({error: `Wrong username or password`});
    }
    catch(err){
        res.status(500).end();
    }
}); 

//POST /api/deliveryEmployeeSessions
router.post('/api/deliveryEmployeeSessions', async (req,res)=>{
    try{
        //Check if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({error: `Empty body request`});
        }
        let user = req.body;
        user.type = 'deliveryEmployee';

        //Check if any field is empty
        if (user === undefined || user.username === undefined || user.password === undefined ||
            user.username == '' || user.password == '') {
                return res.status(500).json({error: `Invalid user data`});
        }
        //Retrieve user from database
        let storedUser = await db.getUserByEmailType(user);
        //Check if user exist
        if (storedUser == ""){
            return res.status(401).end();
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
        return res.status(401).json({error: `Wrong username or password`});
    }
    catch(err){
        res.status(500).end();
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
            return res.status(422).end();
        }
        //Check new or old type is not manager
        if (user.type == 'manager' || user.newType == 'manager') {
            return res.status(422).end();
        }
        //Check old type is correct
        if (user.type !== 'customer' && user.type !== 'qualityEmployee' && user.type !== 'clerk' && 
        user.type !== 'deliveryEmployee' && user.type !== 'supplier') {
            return res.status(404).json({error: `Wrong type`});
        }
        //Check new type is correct
        if (user.newType !== 'customer' && user.newType !== 'qualityEmployee' && user.newType !== 'clerk' && 
        user.newType !== 'deliveryEmployee' && user.newType !== 'supplier') {
            return res.status(404).json({error: `Wrong type`});
        }
        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){
            return res.status(404).json({error: `User does not exist`});
        }
        //Update user
        await db.updateUser(user);   
        return res.status(200).end();
    }
    catch(err){
        res.status(503).end();
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
            return res.status(422).json({error: `Invalid type`});
        }
        //Check if user exist
        let count = await db.checkIfStored(user);
        if (count == 0){
            return res.status(422).json({error: `User does not exist`});
        }
        //Delete user
        await db.deleteUser(user);   
        return res.status(204).end();
    }
    catch(err){
        res.status(503).end();
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
        res.status(503).end();
    }

});


module.exports = router;