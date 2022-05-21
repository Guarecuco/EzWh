const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

let test = {
    name: 'rig everything',
    procedure:  'What a beautiful test',
    idsku: '1'
}

function deleteAllData(expectedHTTPStatus){
    it('Deleting data', function ( done){
        agent.delete('/testDescriptor/deleteAll')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

function addTest(expectedHTTPStatus, order){
    it('Adding a new test', function (done){
        if (test !== undefined && true ){ //TODO the if condition
            //let order = ...
            agent.post('/api/testDescriptor')
                .send(test)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    //res.body.id.should.equal(order.id);
                    done()
                })
        }else{
            agent.post('/api/testDescriptor')
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
        }
    })
}

describe('test testDescriptor apis', () => {
    deleteAllData(204);
    addTest(201, order);
    addTest(422);
})


