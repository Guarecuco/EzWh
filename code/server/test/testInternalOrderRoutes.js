const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);


//*********************************************************************************************** */
//Testing  functions


// Delete all user NOT official API
function dropInternalOrders(expectedHTTPStatus){
    it('Deleting all internal orders (Not official API)', function ( done){
        agent.delete('/api/internalOrdersAll')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}


//GET /api/internalOrders
function getInternalOrders(expectedHTTPStatus, expectedJSON){
    it('GET /api/internalOrders', function (done){
        agent.get('/api/internalOrders') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }
                done();
            })
    })
}

//GET /api/internalOrdersIssued
function getInternalOrdersIssued(expectedHTTPStatus, expectedJSON){
    it('GET /api/internalOrdersIssued', function (done){
        agent.get('/api/internalOrdersIssued') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }
                done();
            })
    })
}

//GET /api/internalOrdersAccepted
function getInternalOrdersAccepted(expectedHTTPStatus, expectedJSON){
    it('GET /api/internalOrdersAccepted', function (done){
        agent.get('/api/internalOrdersAccepted') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }
                done();
            })
    })
}

//GET /api/internalOrders/:id
function getinternalOrdersById(expectedHTTPStatus, expectedJSON, id){
    it('GET /api/internalOrders/:id', function (done){
        agent.get('/api/internalOrders/'+id) 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }
                done();
            })
    })
}

//POST /api/internalOrders
function newInternalOrder(expectedHTTPStatus, issueDate, products, customerId){
    it('POST /api/internalOrders', function (done){
        let order = {
            issueDate: issueDate,
            products: products,
            customerId: customerId
        }
        agent.post('/api/internalOrders')
            .send(order)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//PUT /api/internalOrders/:id
function editInternalOrder(expectedHTTPStatus, id, newState, products){
    it('PUT /api/internalOrders/:id', function (done){
        let body = {
            newState:newState,
            products:products
        }
        agent.put('/api/internalOrders/'+id)
            .send(body)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}


//DELETE /api/internalOrders/:id
function deleteInternalOrder(expectedHTTPStatus,id){
    it('DELETE /api/internalOrders/:id', function (done){
        agent.delete('/api/internalOrders/'+id)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}


//*********************************************************************************************** */
//Some data (SKU) is needed to issue new orders
before(function (done) {
    agent.delete('/api/skus/').then(res => {
        agent.post('/api/sku')
            .send({"description" : "SKU1","weight" : 100,"volume" : 50,"notes" : "Testing SKU","price" : 10.99,"availableQuantity" : 100 })
            .then(function (res) {
            })
        agent.post('/api/sku')
            .send({"description" : "SKU2","weight" : 50,"volume" : 100,"notes" : "Testing SKU 2","price" : 700,"availableQuantity" : 200 })
            .then(function (res) {
            })
        agent.post('/api/sku')
            .send({"description" : "SKU3","weight" : 50,"volume" : 100,"notes" : "Testing SKU 3","price" : 20,"availableQuantity" : 50 })
            .then(function (res) {
                done();
            })
    })
});


//*********************************************************************************************** */
//Call to testing functions

describe('Test internalOrder APIs', () => {
    dropInternalOrders(204);

    newInternalOrder(201,"2021/11/29 09:33", [{"SKUId":1,"description":"SKU1","price":10.99,"qty":3},
                                             {"SKUId":2,"description":"SKU2","price":700,"qty":50}], 1);    //New order with 2 produtcs
    newInternalOrder(201,"2022/05/10 09:33", [{"SKUId":3,"description":"SKU3","price":20,"qty":1}], 1);    //New order with 1 product
    newInternalOrder(201,"2022/05/15 10:45", [{"SKUId":1,"description":"SKU1","price":10.99,"qty":5},
        {"SKUId":3,"description":"SKU3","price":20,"qty":7}], 2);    //New order with 2 produtcs
    newInternalOrder(201,"2022/07/10 15:39", [{"SKUId":1,"description":"SKU1","price":10.99,"qty":8}], 4);    //New order with 1 product
    newInternalOrder(201,"2022/07/12 06:23", [{"SKUId":3,"description":"SKU3","price":20,"qty":8}], 4);    //SKUId doesnt exist
    newInternalOrder(422,"2022/05/10 09:33", "", 1);    //Empty product array
    newInternalOrder(422,"05/10/2022 09:33", "", 1);    //Wrong date format
    newInternalOrder(422,"2022/05/10 09:33", [{"SKUId":"abc","description":"ACME phone","price":800,"qty":3}], 1);    //Wrong skuid - not an integer
    newInternalOrder(422,"2022/05/10 09:33", [{"SKUId":1,"description":"SKU1","price":10.99,"qty":3.5}], 1);   //Wrong qty - not an integer
    newInternalOrder(422,"2022/05/10 09:33", [{"SKUId":1,"description":"SKU1","price":10.99,"qty":3}], 1.3);    //Wrong customerID - not an integer
    newInternalOrder(422,"2022/05/10 09:33", [{"SKUId":1,"description":"SKU1","price":"price","qty":3}], 1);    //Wrong price, not number
    newInternalOrder(422);    //Empty body

    editInternalOrder(200,1,"COMPLETED",[{"SkuID":1,"RFID":"12345678901234567890123456789016"},
        {"SkuID":2,"RFID":"12345678901234567890123456789038"}]);                                    //Change from ISSUED to COMPLETED, also send RFID for each SKUID
    editInternalOrder(200,2,"ACCEPTED","");               //Change from ISSUED to accepted, RFID is not needed
    editInternalOrder(200,3,"REFUSED","TEST products");   //Change from ISSUED to refused, RFID is not needed it is ignored
    editInternalOrder(200,4,"CANCELED","");               //Change from ISSUED to canceled
    editInternalOrder(404,50,"CANCELED","");               //Order ID doesnt exist
    editInternalOrder(422,4,"WRONG","");                    //Wrong status
    editInternalOrder(422,2,"","");                         //Empty status
    editInternalOrder(422,2,"COMPLETED","");                //Empty product array for COMPLETED orders   


    getInternalOrders(200,[
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "COMPLETED",
            "products":[{"SKUId":1,"description":"SKU1","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":2,"description":"SKU2","price":700,"RFID":"12345678901234567890123456789038"}],
            "customerId" : 1
        },
        {
            "id":2,
            "issueDate":"2022/05/10 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":3,"description":"SKU3","price":20,"qty":1}],
            "customerId" : 1
        },
        {
            "id":3,
            "issueDate":"2022/05/15 10:45",
            "state": "REFUSED",
            "products": [{"SKUId":1,"description":"SKU1","price":10.99,"qty":5},
            {"SKUId":3,"description":"SKU3","price":20,"qty":7}],
            "customerId" : 2
        },
        {
            "id":4,
            "issueDate":"2022/07/10 15:39",
            "state": "CANCELED",
            "products": [{"SKUId":1,"description":"SKU1","price":10.99,"qty":8}],
            "customerId" : 4
        },
        {
            "id":5,
            "issueDate":"2022/07/12 06:23",
            "state": "ISSUED",
            "products": [{"SKUId":3,"description":"SKU3","price":20,"qty":8}],
            "customerId" : 4
        }
    ]);
  
    getInternalOrdersIssued(200,[
        {
            "id":5,
            "issueDate":"2022/07/12 06:23",
            "state": "ISSUED",
            "products": [{"SKUId":3,"description":"SKU3","price":20,"qty":8}],
            "customerId" : 4
        }
    ]);

    getInternalOrdersAccepted(200,[
        {
            "id":2,
            "issueDate":"2022/05/10 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":3,"description":"SKU3","price":20,"qty":1}],
            "customerId" : 1
        }
    ]);
    
    getinternalOrdersById(200,{"id":1,"issueDate":"2021/11/29 09:33","state": "COMPLETED",
    "products":[{"SKUId":1,"description":"SKU1","price":10.99,"RFID":"12345678901234567890123456789016"},
                {"SKUId":2,"description":"SKU2","price":700,"RFID":"12345678901234567890123456789038"}],
    "customerId" : 1},1);                                                                                   //OK
    getinternalOrdersById(200,{"id":4,"issueDate":"2022/07/10 15:39","state": "CANCELED",
        "products": [{"SKUId":1,"description":"SKU1","price":10.99,"qty":8}], "customerId" : 4},4);         //OK
    getinternalOrdersById(404,"",96);         //order with ID = 96 doesnt exist

    deleteInternalOrder(204,1)  //OK
    deleteInternalOrder(204,2)  //OK
    deleteInternalOrder(204,3)  //OK
    deleteInternalOrder(204,4)  //OK
    deleteInternalOrder(204,5)  //OK
    deleteInternalOrder(422,96)  //ID doesnt exist

    getInternalOrders(200,[])           //Order were deleted, should be empty    
    getInternalOrdersIssued(200,[])
    getInternalOrdersAccepted(200,[])
})