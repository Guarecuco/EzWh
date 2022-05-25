const internalOrderDao = require('../dao/InternalOrderDAO');
const db = new internalOrderDao('EzWh.db');

function testAddInternalOrder(input,expectedResult) {
    test('Create new internal order', async () => {
        try{
            let res = await db.storeInternalOrder(input);
            expect(res).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }

    });
}

function testAddInternalOrderProducts(input,expectedResult) {
    test('Create new internal order products', async () => {
        try{
            let res = await db.storeInternalOrderProducts(input);
            expect(res).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testCheckIfOrderExists(input,expectedResult) {
    test('Check if order exists', async () => {
        try{
            let res = await db.checkIfOrderExists(input);
            expect(res[0]).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testUpdateInternalOrder(input,expectedResult) {
    test('Edit existing internal order', async () => {
        try{ 
            let res = await db.updateInternalOrder(input);
            expect(res).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testUpdateInternalOrderProduct(input,expectedResult) {
    test('Edit existing internal order product', async () => {
        try{
            let res = await db.updateInternalOrderProducts(input);
            expect(res).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testDeleteInternalOrder(input,expectedResult) {
    test('Delete existing internal order', async () => {
        try{
            let res = await db.deleteInternalOrder(input);
            expect(res).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testDeleteInternalOrderProducts(input,expectedResult) {
    test('Delete existing internal order product', async () => {
        try{
            let res = await db.deleteInternalOrderProducts(input);
            expect(res).toStrictEqual(expectedResult);
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testGetInternalOrder(expectedResult) {
    test('Retrieve internal orders', async () => {
        try{
            let res = await db.getInternalOrders();
            expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testGetInternalOrderProducts(input,expectedResult) {
    test('Retrieve internal orders products', async () => {
        try{
            let res = await db.getInternalOrdersProducts(input);
            expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testGetInternalOrderProductsCompleted(input,expectedResult) {
    test('Retrieve internal orders products of completed orders', async () => {
        try{
            let res = await db.getInternalOrdersProductsCompleted(input);
            expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }     
    });
}

function testGetInternalOrdersByState(input,expectedResult) {
    test('Retrieve internal orders by state', async () => {
        try{
            let res = await db.getInternalOrdersByState(input);
            expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testGetInternalOrdersbyID(input,expectedResult) {
    test('Retrieve internal orders by ID', async () => {
        try{
            let res = await db.getInternalOrdersbyID(input);
            expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expectedResult));
        }
        catch(err){
            expect(err.code).toStrictEqual(expectedResult);
        }
    });
}

function testDropTables() {
    test('Drop Internal Order table', async () => {
        await db.dropInternalOrders();
        await db.dropInternalOrdersProducts();
    });
}

//************************************************************************** */
//Calling test functions
describe('Test Internal Order DAO', () => {
    beforeAll(async () => {
        await db.dropInternalOrders();
        await db.dropInternalOrdersProducts();
        await db.newTableInternalOrders();
        await db.newTableInternalOrdersProducts();
    });

    //Add internal order
    testAddInternalOrder({issueDate:"2021/11/29 09:33",state: "ISSUED",customerId: 1},1);
    //Get all internal orders
    testGetInternalOrder([{id:1,issueDate:"2021/11/29 09:33",state: "ISSUED",products:"",customerId: 1}]);

    //Add internal order products
    testAddInternalOrderProducts({SKUId:12,description:"a product",price:10.99,qty:3,orderId:1},1);
    //Get internal order products by ID
    testGetInternalOrderProducts({id:1},[{SKUId:12,description:"a product",price:10.99,qty:3}]);

    //Check if order 1 exists
    testCheckIfOrderExists({orderId:1},1);

    //Update internal order
    testUpdateInternalOrder({newState:"COMPLETED",orderId: 1},1);
    //Update internal order product
    testUpdateInternalOrderProduct({RFID:"1234567891234567",SKUId:12,orderId: 1},1);
    //Get products of completed order
    testGetInternalOrderProductsCompleted({id:1},[{SKUId:12,description:"a product",price:10.99,RFID:"1234567891234567"}]);

    //Get internal order by state
    testGetInternalOrdersByState("COMPLETED",[{id:1,issueDate:"2021/11/29 09:33",state: "COMPLETED",products:"",customerId: 1}])
    testGetInternalOrdersByState("ISSUED",[])
    testGetInternalOrdersByState("ACCEPTED",[])

    //Get internal order by ID
    testGetInternalOrdersbyID({orderId:1},[{id:1,issueDate:"2021/11/29 09:33",state: "COMPLETED",products:"",customerId: 1}])

    //Delete internal order
    testDeleteInternalOrder({orderId:1},1)
    //Get internal orders, should be empty
    testGetInternalOrder([]);

    //Delete internal order products
    testDeleteInternalOrderProducts({orderId:1},1)
    //Get product from internal order, should be empty
    testGetInternalOrderProducts({id:1},[]);

    /********************************************************************** */
    //Repeat all test without create the proper table, this will generate a SQLLITE_ERROR
    testDropTables();    //DROP TABLE
    testAddInternalOrder({issueDate:"2021/11/29 09:33",state: "ISSUED",customerId: 1},"SQLITE_ERROR");
    testGetInternalOrder("SQLITE_ERROR");
    testAddInternalOrderProducts({SKUId:12,description:"a product",price:10.99,qty:3,orderId:1},"SQLITE_ERROR");
    testGetInternalOrderProducts({id:1},"SQLITE_ERROR");
    testCheckIfOrderExists({orderId:1},"SQLITE_ERROR");
    testUpdateInternalOrder({newState:"COMPLETED",orderId: 1},"SQLITE_ERROR");
    testUpdateInternalOrderProduct({RFID:"1234567891234567",SKUId:12,orderId: 1},"SQLITE_ERROR");
    testGetInternalOrderProductsCompleted({id:1},"SQLITE_ERROR");
    testGetInternalOrdersByState("COMPLETED","SQLITE_ERROR")
    testGetInternalOrdersByState("ISSUED","SQLITE_ERROR")
    testGetInternalOrdersByState("ACCEPTED","SQLITE_ERROR")
    testGetInternalOrdersbyID({orderId:1},"SQLITE_ERROR")
    testGetInternalOrder("SQLITE_ERROR");
    testDeleteInternalOrderProducts({orderId:1},"SQLITE_ERROR")
    testGetInternalOrderProducts({id:1},"SQLITE_ERROR");
   
});
