const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);



function deleteAllData(expectedHTTPStatus){
    it('Deleting data', function ( done){
        agent.delete('/restockOrders/deleteRestockOrders')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

/*function addRestockOrder(expectedHTTPStatus, order){
    it('Adding a new restock order', function (done){
        if (order !== undefined && true ){ //TODO the if condition
            //let order = ...
            agent.post('/api/restockOrder')
                .send(order)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    //res.body.id.should.equal(order.id);
                    done()
                })
        }else{
            agent.post('/api/restockOrder')
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
        }
    })
}*/

function addRestockOrder(expectedHTTPStatus, order){
    it('Adding a new restock order', function (done){
        agent.post('/api/restockOrder')
            .send(order)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                /*if(expectedHTTPStatus === 201){
                    order.id = parseInt(res.text)
                    console.log(order.id)
                }*/
                done();
            })
    })
}

function dropRestockOrders(expectedHTTPStatus){
    it('Deleting data', function ( done){
        agent.delete('/restockOrders/deletetable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function getAllRestockOrdersIssued(expectedHTTPStatus, expectedJSON){
    it('Get a new restock order', function (done){
        agent.get('/api/restockOrdersIssued')
            .then(function (res) {
                console.log(JSON.stringify(expectedJSON))
                console.log(res.text)

                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}


function getRestockOrderById(expectedHTTPStatus, id, expectedJSON){
    it('Get a new restock order', function (done){
        agent.get('/api/restockOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}




describe('test restock order apis', () => {
    let order = {
        issueDate: '2021/11/29 09:33',
        supplierId:  1,
        products: [
            {"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}
        ]
    }

    //POST
    dropRestockOrders(204);
    addRestockOrder(201, order); // new
    addRestockOrder(422);
    let order_rejected = {...order}
    delete order_rejected.products;
    addRestockOrder(422, order_rejected); //products field is undefined
    order_rejected = {...order}; delete order_rejected.issueDate; addRestockOrder(422, order_rejected); //issueDate field is undefined
    order_rejected = {...order}; delete order_rejected.supplierId; addRestockOrder(422, order_rejected); //supplierId field is undefined*/

    //GET
    issued_order = {
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
    let issued_orders = [{id: 1, ...issued_order}]
    //get all issued
    getAllRestockOrdersIssued(200, issued_orders)

    //getById
    getRestockOrderById(200, 1, issued_order) //get issued order
    getRestockOrderById(404, 10) //no restock order associated to id
    getRestockOrderById(422) //validation of id failed

    //get returnable


    //put /api/restockOrder/:id

    //PUT /api/restockOrder/:id/skuItems


    //PUT /api/restockOrder/:id/transportNote


    //DELETE /api/restockOrder/:id


})


