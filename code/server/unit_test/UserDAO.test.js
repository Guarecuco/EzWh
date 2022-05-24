const userDao = require('../dao/UserDAO');
const db = new userDao('EzWh.db');

function testAddUser(input,expectedResult) {
    test('Create new user', async () => {
        
        let res = await db.storeUser(input);
        
        expect(res).toStrictEqual(expectedResult);
    });
}

function testEditUser(input,expectedResult) {
    test('Edit existing user', async () => {

        let res = await db.updateUser(input)
        
        expect(res).toStrictEqual(expectedResult);
    });
}

function testCheckStored(input,expectedResult) {
    test('Check if user exist', async () => {

        let res = await db.checkIfStored(input);

        expect(res[0]).toStrictEqual(expectedResult);
    });
}


function testGetUserByEmailType(input,expectedResult) {
    test('Retrieve user by email and type', async () => {

        let res = await db.getUserByEmailType(input);

        expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
    });
}

function testGetUsers(expectedResult) {
    test('Retrieving users', async () => {

        let res = await db.getStoredUsers();

        expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
    });
}

function testGetSuppliers(expectedResult) {
    test('Retrieving suppliers', async () => {

        let res = await db.getStoredSuppliers();

        expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
    });
}

function testGetUsersWithoutManagers(expectedResult) {
    test('Retrieving users without manager', async () => {

        let res = await db.getStoredUsersWithoutManagers();

        expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
    });
}

function testDeleteUser(input, expectedResult) {
    test('Delete existing user', async () => {
        
        let res = await db.deleteUser(input);
        
        expect(res).toStrictEqual(expectedResult);
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
    testAddUser({username: "user1@ezwh.com",name: "John",surname : "Smith",password : "testpassword",type : "customer"},1);
    //Get user, should be the same as just added
    testGetUsers([{id: 1, name: "John", surname: "Smith", email: "user1@ezwh.com",type: "customer"}]);
    //Get users excluding manager.Should be the same as before
    testGetUsersWithoutManagers([{id: 1, name: "John", surname: "Smith", email: "user1@ezwh.com",type: "customer"}]);
    //Get suppliers, should be empty
    testGetSuppliers([]);
    //Get user using email and type
    testGetUserByEmailType({username: "user1@ezwh.com",type : "customer"},
                [{id: 1, name: "John", surname: "Smith",email: "user1@ezwh.com",password:"testpassword",type: "customer"}]);
    
    //Check if user is stored
    testCheckStored({username: "user1@ezwh.com",type : "customer"},1)
    
    //Edit User to supplier
    testEditUser({username: "user1@ezwh.com",type : "customer", newType: "supplier"},1);
    //Get user, should be the same as just edited
    testGetUsers([{id: 1, name: "John", surname: "Smith", email: "user1@ezwh.com",type: "supplier"}]);
    //Get suppliers, should be the same as just edited
    testGetSuppliers([{id: 1, name: "John", surname: "Smith", email: "user1@ezwh.com"}]);
    
    //Delete user (supplier)
    testDeleteUser({username: "user1@ezwh.com",type : "supplier"},1);
    //Get users, should be empty
    testGetUsers([]);
    //Get suppliers, should be empty
    testGetSuppliers([]);
    //Get users excluding manager.Should be empty
    testGetUsersWithoutManagers([]);
   
});
