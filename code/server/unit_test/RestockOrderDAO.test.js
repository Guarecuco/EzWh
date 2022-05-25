const RestockOrderDAO = require('../dao/RestockOrderDAO.js')
const db = new RestockOrderDAO('EzWh.db')

function testAddRestockOrder(input, id) {
    test('Create new restock order', async () => {

        await db.addRestockOrder(input);

        let res = await db.getRestockOrder(id);

        expect(res.issueDate).toStrictEqual(input.issueDate);
        expect(res.state).toStrictEqual('ISSUED');
        expect(res.products).toStrictEqual(input.products);
        expect(res.supplierId).toStrictEqual(input.supplierId);
        expect(res.skuItems).toStrictEqual([])
    });
}

function testCheckIfStored(id, expected){
    test('Check if restock orders exists', async () => {
        let res = await db.checkIfStored(id)
        expect(res).toEqual(expected);
    })
}

function testGetIssuedRestockOrders(orders){
    test('Get all issued restock orders', async () => {
        let res = await db.getAllRestockOrdersIssued()
        expect(res).toEqual(orders);
    })
}
function testGetAllRestockOrders(orders){
    test('Get all restock orders', async () => {
        let res = await db.getAllRestockOrders()
        expect(res).toEqual(orders);
    })
}


function testGetIssuedOrder(input, id) {
    test('Get an issued restock order', async () => {

        let res = await db.getRestockOrder(id);

        expect(res.issueDate).toStrictEqual(input.issueDate);
        expect(res.state).toStrictEqual('ISSUED');
        expect(res.products).toStrictEqual(input.products);
        expect(res.supplierId).toStrictEqual(input.supplierId);
        expect(res.skuItems).toStrictEqual([])
    });
}

function testGetNotIssuedOrder(input, id) {
    test('Get a restock order which state is != ISSUED', async () => {

        let res = await db.getRestockOrder(id);
        expect(res.issueDate).toStrictEqual(input.issueDate);
        expect(res.state).toStrictEqual(input.state);
        expect(res.products).toStrictEqual(input.products);
        expect(res.supplierId).toStrictEqual(input.supplierId);
        expect(res.transportNote).toStrictEqual(input.transportNote)
        expect(res.skuItems).toStrictEqual(input.skuItems)
    });
}

function testGetDeliveryOrder(input, id) {
    test('Get a restock order which order is == DELIVERY', async () => {

        let res = await db.getRestockOrder(id);

        expect(res.issueDate).toStrictEqual(input.issueDate);
        expect(res.state).toStrictEqual('DELIVERY');
        expect(res.products).toStrictEqual(input.products);
        expect(res.supplierId).toStrictEqual(input.supplierId);
        expect(res.transportNote).toStrictEqual(input.transportNote)
        expect(res.skuItems).toStrictEqual([])
    });
}

function testUpdateState(newState, id){
    test('Changing the state of a restock order given its id', async () => {
        await db.updateRestockOrder(newState, id)
    })
}

function testUpdateTransportNote(transportNote, id){
    test('Changing the transport note of a restock order given its id', async () => {
        await db.updateRestockOrderTransportNote(transportNote, id)
    })
}

function testUpdateSkuItems(skuItems, id){
    test('Changing the sku items of a restock order given its id', async () => {
        await db.updateRestockOrderSKUItems(skuItems, id)
    })
}

function testDeleteRestockOrder(id){
    test('Deleting a restock order', async () => {
        await db.deleteRestockOrder(id)
        let order = await db.getRestockOrder(id)
        expect(order).toBe(undefined)
    } )
}

let newOrder = {
    issueDate: '2021/11/29 09:33',
    supplierId:  1,
    products: [
        {"SKUId":12,"description":"a product","price":10.99,"qty":30},
        {"SKUId":180,"description":"another product","price":11.99,"qty":20}
    ]
}
let deliveredOrder = {
    issueDate: '2021/04/21 06:50',
    supplierId:  2,
    products: [
        {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
        {"SKUId":3,"description":"another nice product","price":11.99,"qty":20}
    ]
}
let deliveryOrder = {
    issueDate: '2021/02/10 18:50',
    supplierId:  3,
    products: [
        {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
    ]
}

const skuItems2 = [{"SKUId": 2, "rfid": "12345678901234567890123456789016"}, {
    "SKUId": 3,
    "rfid": "12345678901234567890123456789017"
}]

const transportNote2 = {deliveryDate: "2021/12/29"}

describe('Test Restock Order DAO', () => {
    beforeAll(async function () {
        await db.dropRestockOrders();
        await db.newTableRestockOrders();
        await db.addRestockOrder(newOrder);
        await db.addRestockOrder(deliveredOrder);
        await db.updateRestockOrder('DELIVERY', 2)
        await db.updateRestockOrderTransportNote(transportNote2, 2)
        await db.updateRestockOrder('DELIVERED', 2)
        await db.updateRestockOrderSKUItems(skuItems2, 2)
        await db.addRestockOrder(deliveryOrder);
        await db.updateRestockOrder('DELIVERY', 3)
        await db.updateRestockOrderTransportNote(transportNote2, 3)

    });
    let order = {
        issueDate: '2021/04/21 06:50',
        supplierId:  2,
        products: [
            {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
            {"SKUId":3,"description":"another nice product","price":11.99,"qty":20}
        ]
    }


    testAddRestockOrder(order, 4);
    testCheckIfStored(4, [1])  //it does exists
    testGetIssuedRestockOrders([{id: 1, ...newOrder, skuItems: [], state: 'ISSUED'},
                                        {id: 4, ...order, skuItems: [], state: 'ISSUED'}])

    deliveredOrder = {id: 2, ...deliveredOrder, state:'DELIVERED', skuItems: skuItems2, transportNote: transportNote2}
    deliveryOrder = {id: 3, ...deliveryOrder, state:'DELIVERY', skuItems: [], transportNote: transportNote2}
    testGetAllRestockOrders([{id: 1, ...newOrder, skuItems: [], state: 'ISSUED'},
                                    deliveredOrder,
                                    deliveryOrder,
                                    {id:4, ...order, skuItems: [], state: 'ISSUED'}])
    testGetIssuedOrder(newOrder, 1)
    testGetNotIssuedOrder(deliveredOrder,2)
    testGetDeliveryOrder(deliveryOrder,3)
    testUpdateState('DELIVERY', 4)
    testUpdateTransportNote({deliveryDate: "2021/12/29"}, 4)
    const skuItems = [{"SKUId":2,"rfid":"12345678901234567890123456789016"},{"SKUId":3,"rfid":"12345678901234567890123456789017"}]
    testUpdateSkuItems(skuItems, 4)

    testDeleteRestockOrder(1);



});

