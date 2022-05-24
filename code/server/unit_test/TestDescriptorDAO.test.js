const testDAO = require('../dao/TestDescriptorDAO');
const db = new testDAO('EzWh.db');

function testAddTest(input) {
    test('Create new test', async () => {
        
        await db.addTest(input);
        
        let res = await db.findTestName(input.name);

        expect(res[0].name).toStrictEqual(input.name);
        expect(res[0].procedureDescription).toStrictEqual(input.procedureDescription);
        expect(res[0].idSKU).toStrictEqual(input.idSKU);
        
    });
}

function testEditTest(input) {
    test('Edit existing test', async () => {

        await db.updateTest(input.id)
        let res = await db.findTestId(input.id);

        expect(res[0].name).toStrictEqual(input.name);
        expect(res[0].procedureDescription).toStrictEqual(input.procedureDescription);
        expect(res[0].idSKU).toStrictEqual(input.idSKU);
    });
}

function testGetTests(input) {
    test('Retrieving tests', async () => {

        let res = await db.getTestsDescriptors();

        if (res[0] !== undefined){
            expect(res[0].id).toStrictEqual(input.id);
            expect(res[0].name).toStrictEqual(input.name);
            expect(res[0].procedureDescription).toStrictEqual(input.procedureDescription);
            expect(res[0].idSKU).toStrictEqual(input.idSKU);
        }
        else{
            expect(res[0]).toStrictEqual([]);
        }
    });
}

function testGetTest(input) {
    test('Retrieving test', async () => {

        await db.updateTest(input.id)
        let res = await db.findTestId(input.id);
        if (res[0] !== undefined){
            expect(res[0].id).toStrictEqual(input.id);
            expect(res[0].name).toStrictEqual(input.name);
            expect(res[0].procedureDescription).toStrictEqual(input.procedureDescription);
            expect(res[0].idSKU).toStrictEqual(input.idSKU);
        }
    });
}



function testDeleteTest(input) {
    test('Delete existing test', async () => {
        
        await db.deleteTest(input);
        
        let res = await db.findTestId(input);

        expect(res[0]).toStrictEqual(undefined);
    });
}



//************************************************************************** */
//Calling test functions
describe('Test TestDescriptor DAO', () => {
    beforeAll(async () => {
        await db.dropTestsTable();
        await db.newTableTests();
    });

    let test={
        name: "prova",
        procedureDescription: "dei test descriptor",
        idSKU: 1
    }
    testAddTest(test)
    /*Get user, should be the same as just added
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
   */
});
