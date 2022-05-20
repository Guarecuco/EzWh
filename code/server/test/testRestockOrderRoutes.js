const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

let order = {
    issueDate: '2021/11/29 09:33',
    supplierId:  1,
    products: [
        {"SKUId":12,"description":"a product","price":10.99,"qty":30},
        {"SKUId":180,"description":"another product","price":11.99,"qty":20}
    ]
}

function deleteAllData(expectedHTTPStatus){
    it('Deleting data', function ( done){
        agent.delete('/restockOrders/deleteRestockOrders')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function addRestockOrder(expectedHTTPStatus, order){
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
}

describe('test restock order apis', () => {
    deleteAllData(204);
    addRestockOrder(201, order);
    addRestockOrder(422);
})


