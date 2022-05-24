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

describe('Test sku APIs', () => {
    deleteAllData(204);

    newSku(201,"a new sku",100,50,"first SKU",10.99,50);    //New
    newSku(422,"",100,50,"first SKU",10.99,50);    //missing field
    newSku(422,"sku2",0,50,"SKU2",10.99,50);    //missing field
    newSku(422,"sku2",50,"SKU2",10.99,50);    //missing field
    newSku(422,"sku2",100,0,"SKU2",10.99,50);    //missing field
    newSku(422,"sku2",100,50,"",10.99,50);    //missing field
    newSku(422,"sku2",100,50,"SKU2",0,50);    //missing field
    newSku(422,"sku2",100,50,"SKU2",10.99);    //missing field
    newSku(422);                                //missing field
    newSku(201,"sku2",100,50,"SKU2",10.99,0);    //zero quantity is fine
    /*
    getSkus(200,[
        {
            "id":1,
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "position" : "",
            "availableQuantity" : 50,
            "price" : 10.99,
            "testDescriptors" : []
        },
        {
            "id":2,
            "description" : "sku2",
            "weight" : 100,
            "volume" : 50,
            "notes" : "SKU2",
            "position" : "",
            "availableQuantity" : 50,
            "price" : 10.99,
            "testDescriptors" : []
        }
    ]
    );
    */
})