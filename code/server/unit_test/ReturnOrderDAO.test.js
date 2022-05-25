const ReturnOrderDAO = require('../dao/ReturnOrderDAO.js')
const RestockOrderDAO = require('../dao/RestockOrderDAO')
const db = new ReturnOrderDAO('EzWh.db')
const rdb = new RestockOrderDAO('EzWh.db')


function testAddReturnOrder(input, id) {
    test('Create new return order', async () => {

        await db.addReturnOrder(input);
        let res = await db.getReturnOrder(id);

        expect(res.restockOrderId).toStrictEqual(input.restockOrderId);
        expect(res.products).toStrictEqual(input.products);
        expect(res.returnDate).toStrictEqual(input.returnDate);
    });
}

function testGetAllReturnOrders(orders){
    test('Get all return orders', async () => {
        let res = await db.getReturnOrders()
        expect(res).toEqual(orders);
    })
}

function testCheckIfRestockOrderIsStored(id, expected){
    test('Check if restock orders exists', async () => {
        let res = await db.checkIfRestockOrderExists(id)
        expect(res).toEqual(expected);
    })
}


function testDeleteReturnOrder(id){
    test('Deleting a return order', async () => {
        await db.deleteReturnOrder(id)
        let order = await db.getReturnOrder(id)
        expect(order).toBe(undefined)
    } )
}

let newOrder = {
    returnDate:"2021/11/29 09:33",
    products: [{"SKUId":12,"description":"a product","price":10.99,               "RFID":"12345678901234567890123456789016"},
        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
    restockOrderId : 1
}

let newOrder2 = {
    returnDate:"2021/03/10 01:11",
    products: [{"SKUId":12,"description":"a product","price":10.99,               "RFID":"12345678901234567890123456789016"},],
    restockOrderId : 2
}




describe('Test Return Order DAO', () => {
    beforeAll(async function () {
        const restockOrder = {
            issueDate: '2021/11/29 09:33',
            supplierId:  1,
            products: [
                {"SKUId":12,"description":"a product","price":10.99,"qty":30},
                {"SKUId":180,"description":"another product","price":11.99,"qty":20}
            ]
        }
        await db.dropReturnOrders();
        await db.newTableReturnOrders();
        await rdb.dropRestockOrders();
        await rdb.newTableRestockOrders()
        await rdb.addRestockOrder(restockOrder)
    });

    testCheckIfRestockOrderIsStored(1, [1])
    testCheckIfRestockOrderIsStored(2, [0])

    testAddReturnOrder(newOrder, 1);
    testAddReturnOrder(newOrder2, 2);   //the return order is issued even though the restock order doesn't exist
                                            // because the check is performed at upper layers
    testGetAllReturnOrders([{id: 1, ...newOrder}, {id: 2, ...newOrder2}])



    testDeleteReturnOrder(1);



});

