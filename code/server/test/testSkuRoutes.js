const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

function deleteAllData(expectedHTTPStatus) {
    it('Deleting data (Not official API)', function (done) {
        agent.delete('/api/skus')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    });
}

function deleteAllPositions(expectedHTTPStatus) {
    it('Deleting data (Not official API)', function (done) {
        agent.delete('/api/position')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    });
}

function dropTestsTable(expectedHTTPStatus){
    it('Dropping table', function ( done){
        agent.delete('/testDescriptor/dropTable')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

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

function newPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume){
    it('POST /api/position', function (done){
        let pos = {
            positionID : positionID,
            aisleID : aisleID,
            row : row,
            col : col,
            maxWeight : maxWeight,
            maxVolume : maxVolume,
        }
        agent.post('/api/position')
            .send(pos)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//POST /api/sku
function newSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity){
    it('POST /api/sku', function (done){
        let sku = {
            description : description,
            weight : weight,
            volume : volume,
            notes : notes,
            price : price,
            availableQuantity : availableQuantity,
        }
        agent.post('/api/sku')
            .send(sku)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/skus
function getSkus(expectedHTTPStatus, expectedJSON){
    it('GET /api/skus', function (done){
        agent.get('/api/skus') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/skus/:id
function getSku(expectedHTTPStatus, id, expectedJSON){
    it('GET /api/skus/:id', function (done){
        agent.get('/api/skus/'+id)
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

//PUT /api/sku/:id
function updateSku(expectedHTTPStatus, id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity){
    it('PUT /api/sku/:id', function (done){
        let pos = {
            newDescription: newDescription,
            newWeight: newWeight,
            newVolume: newVolume,
            newNotes: newNotes,
            newPrice: newPrice,
            newAvailableQuantity: newAvailableQuantity
        }

        agent.put('/api/sku/'+id)
            .send(pos)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//PUT /api/sku/:id/position
function updateSkuPosition(expectedHTTPStatus, id, position){
    it('PUT /api/sku/:id/position', function (done){
        let pos = {
            position: position
        }

        agent.put('/api/sku/'+id+'/position')
            .send(pos)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//DELETE /api/skus/:id
function deleteSku(expectedHTTPStatus, id){
    it('DELETE /api/skus/:id', function (done){
        agent.delete('/api/skus/'+id)
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

describe('Test sku APIs', () => {
    deleteAllData(204);
    deleteAllPositions(204);
    dropTestsTable(204);

    newPosition(201,"800234543412","8002","3454","3412",1000,1000); //new position

    //POST /api/sku
    newSku(201,"a new sku",100,50,"first SKU",10.99,50);    //New(1)
    newSku(422,"",100,50,"first SKU",10.99,50);    //missing field
    newSku(422,"sku2",0,50,"SKU2",10.99,50);    //missing field
    newSku(422,"sku2",50,"SKU2",10.99,50);    //missing field
    newSku(422,"sku2",100,0,"SKU2",10.99,50);    //missing field
    newSku(422,"sku2",100,50,"",10.99,50);    //missing field
    newSku(422,"sku2",100,50,"SKU2",0,50);    //missing field
    newSku(422,"sku2",100,50,"SKU2",10.99);    //missing field
    newSku(422);                                //missing field
    newSku(201,"sku2",100,50,"SKU2",10.99,0);    //zero quantity is fine(2)

    //PUT /api/sku/:id/position
    updateSkuPosition(422,1,"800234543412"); //not enough space

    //PUT /api/sku/:id
    updateSku(200,1,"a new sku",100,50,"first SKU",10.99,10); //ok
    updateSku(422,1,"a new sku",100,50,"first SKU",0,10); //missing field
    updateSku(422,1,"a new sku",0,50,"first SKU",10.99,10); //missing field
    updateSku(422,1,"a new sku",100,0,"first SKU",10.99,10); //missing field

    //PUT /api/sku/:id/position
    updateSkuPosition(200,1,"800234543412"); //now enough space
    updateSkuPosition(404,1,"111111111111"); //position not found
    updateSkuPosition(404,3,"800234543412"); //sku not found

    updateSku(422,1,"a new sku",100,50,"first SKU",10.99,50); //not enough space

    addTest(201, {id: 2,name: 'test2',procedureDescription:  'Another beautiful test',idSKU: 1});
    addTest(201, {id: 1,name: 'test1',procedureDescription:  'What a beautiful test',idSKU: 1});
    addTest(201, {id: 3,name: 'test3',procedureDescription:  'Separeted test',idSKU: 2});
    
    getSkus(200,[
        {
            "id":1,
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "position" : "800234543412",
            "availableQuantity" : 10,
            "price" : 10.99,
            "testDescriptors" : [1,2]
        },
        {
            "id":2,
            "description" : "sku2",
            "weight" : 100,
            "volume" : 50,
            "notes" : "SKU2",
            "position" : "",
            "availableQuantity" : 0,
            "price" : 10.99,
            "testDescriptors" : [3]
        }
    ]
    );

    getSku(200,1,{
        "description" : "a new sku",
        "weight" : 100,
        "volume" : 50,
        "notes" : "first SKU",
        "position" : "800234543412",
        "availableQuantity" : 10,
        "price" : 10.99,
        "testDescriptors" : [1,2]
    });

    getSku(404,3,{error: "Sku not found"});

    //DELETE /api/skus/:id
    deleteSku(204,1);
    deleteSku(422,3);

    getSku(404,1,{error: "Sku not found"});
})