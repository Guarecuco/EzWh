const userDao = require('../dao/UserDAO');
const db = new userDao('EzWh.db');

function testAddUser(input) {
    test('Create new user', async () => {
        
        await db.storeUser(input);
        
        let res = await db.getUserByEmailType(input);

        expect(res[0].name).toStrictEqual(input.name);
        expect(res[0].surname).toStrictEqual(input.surname);
        expect(res[0].username).toStrictEqual(input.email);
        expect(res[0].type).toStrictEqual(input.type);
        expect(res[0].password).toStrictEqual(input.password);
    });
}

function testEditUser(input) {
    test('Edit existing user', async () => {

        await db.updateUser(input)
        input.type = input.newType
        let res = await db.getUserByEmailType(input);

        expect(res[0].username).toStrictEqual(input.email);
        expect(res[0].type).toStrictEqual(input.newType);
    });
}

function testCheckStored(input) {
    test('Retrieve user by email and type', async () => {

        let res = await db.checkIfStored(input);

        if (res[0] !== undefined){
            expect(res[0]).toStrictEqual(input.count);
        }
        else{
            expect(res[0]).toStrictEqual(input);
        }
    });
}


function testGetUserByEmailType(input) {
    test('Retrieve user by email and type', async () => {

        let res = await db.getUserByEmailType(input);

        if (res[0] !== undefined){
            expect(res[0].name).toStrictEqual(input.name);
            expect(res[0].surname).toStrictEqual(input.surname);
            expect(res[0].username).toStrictEqual(input.email);
            expect(res[0].type).toStrictEqual(input.type);
        }
        else{
            expect(res[0]).toStrictEqual(input);
        }
    });
}

function testGetUsers(input) {
    test('Retrieving users', async () => {

        let res = await db.getStoredUsers();

        if (res[0] !== undefined){
            expect(res[0].name).toStrictEqual(input.name);
            expect(res[0].surname).toStrictEqual(input.surname);
            expect(res[0].username).toStrictEqual(input.email);
            expect(res[0].type).toStrictEqual(input.type);
        }
        else{
            expect(res[0]).toStrictEqual(input);
        }
    });
}

function testGetSuppliers(input) {
    test('Retrieving suppliers', async () => {

        let res = await db.getStoredSuppliers();

        if (res[0] !== undefined){
            expect(res[0].name).toStrictEqual(input.name);
            expect(res[0].surname).toStrictEqual(input.surname);
            expect(res[0].username).toStrictEqual(input.email);
        }
        else{
            expect(res[0]).toStrictEqual(input);
        }
    });
}

function testGetUsersWithoutManagers(input) {
    test('Retrieving users without manager', async () => {

        let res = await db.getStoredUsersWithoutManagers();

        if (res[0] !== undefined){
            expect(res[0].name).toStrictEqual(input.name);
            expect(res[0].surname).toStrictEqual(input.surname);
            expect(res[0].username).toStrictEqual(input.email);
            expect(res[0].type).toStrictEqual(input.type);
        }
        else{
            expect(res[0]).toStrictEqual(input);
        }
    });
}

function testDeleteUser(input) {
    test('Delete existing user', async () => {
        
        await db.deleteUser(input);
        
        let res = await db.getUserByEmailType(input);

        expect(res[0]).toStrictEqual(undefined);
    });
}



//************************************************************************** */
//Calling test functions
describe('Test User DAO', () => {
    beforeAll(async () => {
        await db.dropUsers();
        await db.newTableUsers();
    });

    //Add user
    testAddUser({username: "user1@ezwh.com",name: "John",surname : "Smith",password : "testpassword",type : "customer"});
    //Get user, should be the same as just added
    testGetUsers({username: "user1@ezwh.com",name: "John",surname : "Smith",type : "customer"});
    //Get users excluding manager
    testGetUsersWithoutManagers({username: "user1@ezwh.com",name: "John",surname : "Smith",type : "customer"});
    //Get user using email and type
    testGetUserByEmailType({username: "user1@ezwh.com",name: "John",surname : "Smith",password : "testpassword",type : "customer"});
    //Check if user is stored
    testCheckStored({username: "user1@ezwh.com",type : "customer",count:1})
    
    //Edit User to supplier
    testEditUser({username: "user1@ezwh.com",type : "customer", newType: "supplier"});
    //Get user, should be the same as just edited
    testGetUsers({username: "user1@ezwh.com",name: "John",surname : "Smith",type : "supplier"});
    //Get suppliers, should be the same as just edited
    testGetSuppliers({username: "user1@ezwh.com",name: "John",surname : "Smith"});
    
    //Delete user (supplier)
    testDeleteUser({username: "user1@ezwh.com",type : "supplier"});
    //Get users, should be empty
    testGetUsers(undefined);
   
});
