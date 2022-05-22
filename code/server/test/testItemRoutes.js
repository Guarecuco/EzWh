const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);


function dropItemsTable(expectedHTTPStatus){
    it('Dropping table', function ( done){
        agent.delete('/items/dropTable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//GET
function getAllItems(expectedHTTPStatus, expectedJSON){
    it('Get a all items', function (done){
        agent.get('/api/items')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal('['+JSON.stringify(expectedJSON)+']');
                done();
            })
    })
}

function getItem(expectedHTTPStatus, id, expectedJSON){
    it('Get an item', function (done){
        agent.get('/api/items/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (expectedHTTPStatus === 200)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}
//POST
function addItem(expectedHTTPStatus, item){
    it('Adding a new item', function (done){
        agent.post('/api/item')
                .send(item)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
    })
}

//PUT
function modTest(expectedHTTPStatus, id, modification){
    it('Modifying an item', function (done){
        agent.put('/api/item/' + id)
                .send(modification)
                .then(function (res){
                    
                    res.should.have.status(expectedHTTPStatus);
                    
                    done()
                })
    })
}
describe('test Items apis', () => {

    let item = {
        id: 1,
        name: 'rig everything',
        procedureDescription:  'What a beautiful test',
        idSKU: 1
    }
   
    let modbody={
        name: 'rig something',
        procedureDescription:  'What a beautiful test',
        idSKU: 1
    }

    //deleteAllData(204);
    dropItemssTable(204);
    addTest(201, test);
    addTest(422);

    getAllItems(200, test);

    getTest(200, 1, test);
    
    modTest(200, 1, modbody)
    
})


