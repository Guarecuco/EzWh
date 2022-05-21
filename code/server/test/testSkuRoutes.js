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
            })
    })
}

describe('Test sku APIs', () => {
    deleteAllData(204);

    newSku(201,"a new sku",100,50,"first SKU",10.99,50);    //New
})