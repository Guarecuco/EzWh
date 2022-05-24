const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);



function addRestockOrder(expectedHTTPStatus, order){
    it('Adding a new restock order', function (done){
        agent.post('/api/restockOrder')
            .send(order)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function dropRestockOrders(expectedHTTPStatus){
    it('Dropping table', function ( done){
        agent.delete('/restockOrders/deletetable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function getAllRestockOrders(expectedHTTPStatus, expectedJSON){
    it('Get all restock order', function (done){
        agent.get('/api/restockOrders')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

function getAllRestockOrdersIssued(expectedHTTPStatus, expectedJSON){
    it('Get all issued restock orders', function (done){
        agent.get('/api/restockOrdersIssued')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}


function getRestockOrderById(expectedHTTPStatus, id, expectedJSON){
    it('Get a restock order (by id)', function (done){
        agent.get('/api/restockOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

function getAllReturnablesById(expectedHTTPStatus, id, expectedJSON){
    it('Get list of returnable items of a restock order (by id)', function (done){
        agent.get('/api/restockOrders/' + id + '/returnItems')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

function updateRestockOrder(expectedHTTPStatus, newState, id){
    it('Updating the state of a restock order', function (done){
        agent.put('/api/restockOrder/' + id)
            .send(newState)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}


function updateRestockOrderSKUItems(expectedHTTPStatus, skuItems, id){
    it('Update skuItems of a restock order', function (done){
        agent.put('/api/restockOrder/' + id + '/skuItems')
            .send(skuItems)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function updateRestockOrderTransportNote(expectedHTTPStatus, transportNote, id){
    it('Update transportNote of a restock order', function (done){
        agent.put('/api/restockOrder/' + id + '/transportNote')
            .send(transportNote)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function deleteRestockOrder(expectedHTTPStatus, id){
    it('Delete restock order', function (done){
        agent.delete('/api/restockOrder/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

before(function (done) {
    let testDescriptor = {
        name:"test descriptor 1",
        procedureDescription:"simple description",
        idSKU: 2
    }

    let failedTestRes =  {
        rfid:"12345678901234567890123456789016",
        idTestDescriptor: 1,
        Date:"2021/11/28",
        Result: true
    }

    agent.delete('/testDescriptor/dropTable').then(res => {
        agent.delete('/skuItems/dropTable').then(function (res) {
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    agent.post('/api/skuitems/testResult')
                        .send(failedTestRes)
                        .then(function (res) {
                            done()
                        })
                })
        })
    })
});


describe('test restock order apis', () => {
    let order = {
        issueDate: '2021/11/29 09:33',
        supplierId:  1,
        products: [
            {"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}
        ]
    }
    let order2 = {
        issueDate: '2021/04/21 06:50',
        supplierId:  2,
        products: [
            {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
            {"SKUId":3,"description":"another nice product","price":11.99,"qty":20}
        ]
    }

    //POST /api/restockOrder
    dropRestockOrders(204);
    addRestockOrder(201, order); // new
    addRestockOrder(201, order2); // new
    addRestockOrder(422);
    let order_rejected = {...order}
    delete order_rejected.products;
    addRestockOrder(422, order_rejected); //products field is undefined
    order_rejected = {...order}; delete order_rejected.issueDate; addRestockOrder(422, order_rejected); //issueDate field is undefined
    order_rejected = {...order}; delete order_rejected.supplierId; addRestockOrder(422, order_rejected); //supplierId field is undefined*/

    //GET
    let issued_order = {
        issueDate: "2021/11/29 09:33",
        state: "ISSUED",
        supplierId: 1,
        products: [
            {
                SKUId: 12,
                description: "a product",
                price: 10.99,
                qty: 30
            },
            {
                SKUId: 180,
                description: "another product",
                price: 11.99,
                qty: 20
            }
        ],
        skuItems: []
    }
    let issued_order2 = {
        issueDate: "2021/04/21 06:50",
        state: "ISSUED",
        supplierId: 2,
        products: [
            {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
            {"SKUId":3,"description":"another nice product","price":11.99,"qty":20}
        ],
        skuItems: []
    }

    //GET /api/restockOrders
    //spostata alla fine per facilitare la lettura

    //GET /api/restockOrdersIssued
    let issued_orders = [{id: 1, ...issued_order}, {id: 2, ...issued_order2}]
    getAllRestockOrdersIssued(200, issued_orders)

    //GET /api/restockOrders/:id
    getRestockOrderById(200, 1, issued_order) //get issued order
    getRestockOrderById(404, 10) //no restock order associated to id
    getRestockOrderById(422) //validation of id failed

    //GET /api/restockOrders/:id/returnItems
    //moved to end of file

    //put /api/restockOrder/:id
    updateRestockOrder(200, {newState: 'DELIVERED'}, 1) //OK
    updateRestockOrder(422, {newState: 'BAD STATE'}, 1) // the state is invalid
    updateRestockOrder(404, {newState: 'DELIVERED'}, 10) // id is invalid
    updateRestockOrder(422, {}, 1) // incomplete body

    //PUT /api/restockOrder/:id/skuItems
    const skuItems = {skuItems: [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]}
    updateRestockOrder(200, {newState: 'ISSUED'}, 1)
    updateRestockOrderSKUItems(422, skuItems, 1 ) //state is != DELIVERED -> 422
    updateRestockOrder(200, {newState: 'DELIVERED'}, 1)
    updateRestockOrderSKUItems(404, skuItems, 3 ) // invalid id
    updateRestockOrderSKUItems(200, skuItems, 1) // OK
    updateRestockOrderSKUItems(200, skuItems, 1) // merge arrays


    //PUT /api/restockOrder/:id/transportNote
    updateRestockOrder(200, {newState: 'ISSUED'}, 1)
    const transportNote = { transportNote: { deliveryDate: '2023/12/29'} }
    updateRestockOrderTransportNote(422, transportNote, 1)  // current state is not 'DELIVERED'
    updateRestockOrder(200, {newState: 'DELIVERY'}, 1)
    updateRestockOrderTransportNote(200, transportNote, 1)  // ok
    updateRestockOrderTransportNote(404, transportNote, 5)  // id is invalid
    const deliveryDate = '2000/12/29'
    let transportNote2 = { transportNote: { deliveryDate: deliveryDate} }
    updateRestockOrderTransportNote(422, transportNote2, 1)  // delivery date is before issue date


    //DELETE /api/restockOrder/:id
    deleteRestockOrder(204, 1) //ok
    deleteRestockOrder(422, 'aa') //validation of id failed
    deleteRestockOrder(422, undefined) //validation of id failed


    //GET /api/restockOrders
    order = {
        issueDate: '2021/11/29 09:33',
        supplierId:  1,
        products: [
            {"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}
        ]
    }
    order2 = {
        issueDate: '2021/04/21 06:50',
        supplierId:  2,
        products: [
            {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
            {"SKUId":3,"description":"another nice product","price":11.99,"qty":20}
        ]
    }
    let order3 = {
        issueDate: '2021/02/10 18:50',
        supplierId:  3,
        products: [
            {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
        ]
    }

    let issuedOrder = {
        id: 1,
        issueDate: "2021/11/29 09:33",
        state: "ISSUED",
        supplierId: 1,
        products: [
            {
                SKUId: 12,
                description: "a product",
                price: 10.99,
                qty: 30
            },
            {
                SKUId: 180,
                description: "another product",
                price: 11.99,
                qty: 20
            }
        ],
        skuItems: []

    }

    let notIssuedStateOrder = {
        id: 2,
        issueDate: "2021/04/21 06:50",
        state: "DELIVERED",
        supplierId: 2,
        transportNote: {deliveryDate: "2021/12/29"},
        products: [
        {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
        {"SKUId":3,"description":"another nice product","price":11.99,"qty":20}
    ],
        skuItems: [{"SKUId":2,"rfid":"12345678901234567890123456789016"},{"SKUId":3,"rfid":"12345678901234567890123456789017"}]
    }

    let deliveryOrder = {
        id: 3,
        issueDate: '2021/02/10 18:50',
        state: 'DELIVERY',
        supplierId:  3,
        transportNote: {deliveryDate: "2021/12/29"},
        products: [
            {"SKUId":2,"description":"nice product","price":10.99,"qty":30},
        ],
        skuItems: []

    }




    //GET /api/restockOrders
    dropRestockOrders(204);
    addRestockOrder(201, order); // new
    deleteRestockOrder(204, 1);
    getAllRestockOrders(200, []) //test empty table

    dropRestockOrders(204);
    addRestockOrder(201, order); // new
    addRestockOrder(201, order2); // new
    addRestockOrder(201, order3); // new

    const skuItems2 = {skuItems: [{"SKUId":2,"rfid":"12345678901234567890123456789016"},{"SKUId":3,"rfid":"12345678901234567890123456789017"}]}
    updateRestockOrder(200, {newState: 'DELIVERY'}, 2)
    transportNote2 = {transportNote: {deliveryDate: "2021/12/29"}}
    updateRestockOrderTransportNote(200, transportNote2, 2)
    updateRestockOrder(200, {newState: 'DELIVERED'}, 2)
    updateRestockOrderSKUItems(200, skuItems2, 2)

    updateRestockOrder(200, {newState: 'DELIVERY'}, 3)
    updateRestockOrderTransportNote(200, transportNote2, 3)

    let expectedList = [issuedOrder, notIssuedStateOrder, deliveryOrder]
    getAllRestockOrders(200, expectedList)


    //GET /api/restockOrders/:id/returnItems     moved to end of file
    updateRestockOrder(200, {newState: 'COMPLETEDRETURN'}, 2)
    const returnableItems = [{"SKUId":2,"rfid":"12345678901234567890123456789016"}]
    getAllReturnablesById(200, 2, returnableItems) // ok

    getAllReturnablesById(404, 5, returnableItems) // id not found
    getAllReturnablesById(422, 1, returnableItems) // state is not COMPLETEDRETURN


})


