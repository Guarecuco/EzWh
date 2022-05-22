const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

function deleteAllData(expectedHTTPStatus) {
    it('Deleting data (Not official API)', function (done) {
        agent.delete('/api/skuitems')
            .then(function (res) {
                done();
            }).catch((err)=>console.log(err));
    });
}

//POST /api/skuitem
function newSkuitem(expectedHTTPStatus, RFID, SKUId, DateOfStock){
    it('POST /api/skuitem', function (done){
        let skuitem = {
            RFID : RFID,
            SKUId : SKUId,
            DateOfStock : DateOfStock,
        }
        agent.post('/api/skuitem')
            .send(skuitem)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/skuitems
function getSkus(expectedHTTPStatus, expectedJSON){
    it('GET /api/skuitems', function (done){
        agent.get('/api/skuitems') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

describe('Test skuitem APIs', () => {
    agent.delete('/api/skuitems').then(function (res) {done();})
    agent.delete('/api/skus').then(function (res) {done();})
    agent.post('/api/sku').send({description : "a new sku",weight : 100,volume : 50,notes : "first SKU",price : 10.99,availableQuantity : 50}).then(function (res){done();})
    
    newSkuitem(201,"12345678901234567890123456789014",2,"2021/11/29 12:30");    //New
    newSkuitem(422,"",1,"2021/11/29 12:30");    //Empty field
    newSkuitem(422,"12345678901234567890123456789015","2021/11/29 12:30");    //Empty field
    newSkuitem(422,"12345678901234567890123456789015",1,"");    //Empty field
    newSkuitem(422);    //Empty field
    newSkuitem(404,"12345678901234567890123456789015",0,"2021/11/29 12:30");    //no SKU associated to id
    newSkuitem(201,"12345678901234567890123456789016",1,"2021/11/29 12:30");    //New

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