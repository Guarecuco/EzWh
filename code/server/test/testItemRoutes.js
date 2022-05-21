const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

let item = {
    description: 'paper',
    price: 10.99,
    skuid:  1,
    supplierid: 2
}

function deleteAllData(expectedHTTPStatus){
    it('Deleting data', function ( done){
        agent.delete('/items/deleteAll')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function addTest(expectedHTTPStatus, order){
    it('Adding a new test', function (done){
        if (item !== undefined && true ){ //TODO the if condition
            //let order = ...
            agent.post('/api/item')
                .send(item)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    //res.body.id.should.equal(order.id);
                    done()
                })
        }else{
            agent.post('/api/item')
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
        }
    })
}

describe('test Item apis', () => {
    deleteAllData(204);
    addTest(201, order);
    addTest(422);
})


