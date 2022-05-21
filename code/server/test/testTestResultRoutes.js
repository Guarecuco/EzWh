const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

let result = {
    rfid: '12345678987654321',
    idtest:  1,
    data: '12-02-2020',
    result: 1
}

function deleteAllData(expectedHTTPStatus){
    it('Deleting data', function ( done){
        agent.delete('/skuItems/deleteAll')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function addTest(expectedHTTPStatus, order){
    it('Adding a new test result', function (done){
        if (result !== undefined && true ){ //TODO the if condition
            //let order = ...
            agent.post('/api/skuitems/testResult')
                .send(result)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    //res.body.id.should.equal(order.id);
                    done()
                })
        }else{
            agent.post('/api/skuitems/testResult')
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
        }
    })
}

describe('test testResults apis', () => {
    deleteAllData(204);
    addTest(201, result);
    addTest(422);
})

