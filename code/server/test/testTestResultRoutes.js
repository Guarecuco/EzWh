const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);


function dropResultsTable(expectedHTTPStatus){
    it('Dropping table', function ( done){
        agent.delete('/skuItems/dropTable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//GET

function getAllResultsRFID(expectedHTTPStatus, rfid, expectedJSON){
    it('Get a result', function (done){
        agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function (res){
                console.log(res.text);
                console.log('['+JSON.stringify(expectedJSON)+']')
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal('['+JSON.stringify(expectedJSON)+']');
                done()
            })
    })
}
//POST
function addResult(expectedHTTPStatus, result){
    it('Adding a new result', function (done){
        agent.post('/api/skuitems/testResult')
                .send(result)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
    })
}

//PUT
function modResult(expectedHTTPStatus, rfid, id, modification){
    it('Modifying a result', function (done){
        agent.put('/api/skuitems/'+rfid+'/testResult/' + id)
                .send(modification)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    
                    done()
                })
    })
}
describe('test testResults apis', () => {

    let result = {
        id:1,
        rfid:"12345678901234567890123456789016",
        idTestDescriptor:1,
        Date: '2021/11/28',
        Result: false

    }
    let resultfail = {
        id:1,
        rfid:"12345678901234567890123456789016",
        idTestDescriptor:10,
        Date: '2021/11/28',
        Result: false

    }
    let output = {
        id:1,
        idTestDescriptor:1,
        Date: '2021/11/28',
        Result: false

    }
    let modbody= {
            "newIdTestDescriptor":1,
            "newDate":"2021/11/28",
            "newResult": true
    }

    let modbodyfail= {
        "newIdTestDescriptor":44,
        "newDate":"2021/11/28",
        "newResult": true
}
    


    //deleteAllData(204);
    dropResultsTable(204);

    addResult(201, result);
    addResult(404, resultfail); //testo does not exist
    addResult(422);

    getAllResultsRFID(200, '12345678901234567890123456789016', output);
    getAllResultsRFID(200, '76543456765432345654345654', NaN);
    
    modResult(200,"12345678901234567890123456789016", 1, modbody);
    modResult(404,"12345678901234567890123456789016", 1, {});
    
})
