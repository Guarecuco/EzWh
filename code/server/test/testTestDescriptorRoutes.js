const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);


function dropTestsTable(expectedHTTPStatus){
    it('Dropping table', function ( done){
        agent.delete('/testDescriptor/dropTable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//GET
function getAllTests(expectedHTTPStatus, expectedJSON){
    it('Get a all tests', function (done){
        agent.get('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal('['+JSON.stringify(expectedJSON)+']');
                done();
            })
    })
}

function getTest(expectedHTTPStatus, id, expectedJSON){
    it('Get a test', function (done){
        agent.get('/api/testDescriptors/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}
//POST
function addTest(expectedHTTPStatus, test){
    it('Adding a new test', function (done){
        agent.post('/api/testDescriptor')
                .send(test)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
    })
}

//PUT
function modTest(expectedHTTPStatus, id, modification){
    it('Modifying a test', function (done){
        agent.put('/api/testDescriptor/' + id)
                .send(modification)
                .then(function (res){
                    
                    res.should.have.status(expectedHTTPStatus);
                    
                    done()
                })
    })
}
describe('test testDescriptor apis', () => {

    let test = {
        id: 1,
        name: 'rig everything',
        procedureDescription:  'What a beautiful test',
        idSKU: 1
    }

    let testfail422 = {
        id: 1,
        procedureDescription:  'What a beautiful test',
        idSKU: 1
    }
   
    let modbody={
        name: 'rig something',
        procedureDescription:  'What a beautiful test',
        idSKU: 1
    }

    //deleteAllData(204);
    dropTestsTable(204);

    addTest(201, test);
    addTest(422, test); //already existing
    addTest(201, testfail422);
    addTest(422);

    getAllTests(200, test);

    getTest(200, 1, test);
    
    modTest(200, 1, modbody)
    
})


