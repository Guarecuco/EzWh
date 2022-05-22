const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

function dropReturnOrders(expectedHTTPStatus){
    it('Dropping table', function ( done){
        agent.delete('/returnOrders/deletetable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function dropRestockOrders() {
    agent.delete('/restockOrders/deletetable')
}

function addRestockOrder(order){
    agent.post('/api/restockOrder')
        .send(order)
        .then(function (res) {
            done();
        })
}

function addReturnOrder(expectedHTTPStatus, order){
    it('Adding a new return order', function (done){
        agent.post('/api/returnOrder')
            .send(order)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function getAllReturnOrders(expectedHTTPStatus, expectedJSON){
    it('Get all return orders', function (done){
        agent.get('/api/returnOrders')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

function getReturnOrderById(expectedHTTPStatus, id, expectedJSON){
    it('Get a return order (by id)', function (done){
        agent.get('/api/returnOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

function deleteReturnOrder(expectedHTTPStatus, id){
    it('Delete return order', function (done){
        agent.delete('/api/returnOrder/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

describe('test return order apis', () => {
    beforeEach(async () => {
        await dropRestockOrders()
    });


    let order = {
        returnDate:"2021/11/29 09:33",
        products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
            {SKUId:180,description:"another product",price:11.99, RFID:"12345678901234567890123456789038"}],
        restockOrderId : 1
    }
    let order2 = {
        returnDate:"2021/02/10 15:10",
        products: [{SKUId:3,description:"a good product",price:1.99, RFID:"123"},
            {SKUId:4,description:"another good product",price:5.99,RFID:"456"}],
        restockOrderId : 10
    }
    let order3 = {
        returnDate:"2021/02/10 15:10",
        products: [{SKUId:3,description:"a good product",price:1.99, RFID:"123"},
            {SKUId:4,description:"another good product",price:5.99,RFID:"456"}],
        restockOrderId : 1
    }
    dropReturnOrders(204)
    //POST /api/returnOrder
    addReturnOrder(201, order); // new
    addReturnOrder(404, order2) //invalid restock id field

    addReturnOrder(201, order3)
    addReturnOrder(422) //invalid body
    addReturnOrder(422, {}) //invalid body


    //GET /api/returnOrders
    //TODO
    //const allExpectedRecords = [{id:1, ...order},{id:2, ...order2}]
    //getAllReturnOrders(200, allExpectedRecords)

    //GET /api/returnOrders/:id
    getReturnOrderById(200, 1, {...order} )
    getReturnOrderById(404, 99, {...order} ) //no return order associated to id
    getReturnOrderById(422, undefined, {...order} ) //no return order associated to id


    //DELETE /api/returnOrder/:id
    deleteReturnOrder(204, 1)
    deleteReturnOrder(422, undefined) //validation of id failed

})
