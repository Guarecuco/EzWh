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

        console.log(input)
        console.log(res[0])
        expect(res[0].name).toStrictEqual(input.name);
        expect(res[0].surname).toStrictEqual(input.surname);
        expect(res[0].username).toStrictEqual(input.email);
        expect(res[0].type).toStrictEqual(input.newType);
        expect(res[0].password).toStrictEqual(input.password);
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

    let newUser =     {
        username: "user1@ezwh.com",
        name: "John",
        surname : "Smith",
        password : "testpassword",
        type : "customer"
    }
    let editUser =     {
        username: "user1@ezwh.com",
        name: "John",
        surname : "Smith",
        password : "testpassword",
        type : "customer",
        newType : "supplier"
    }

    testAddUser(newUser);
    testEditUser(editUser);
    testDeleteUser(newUser);
});
