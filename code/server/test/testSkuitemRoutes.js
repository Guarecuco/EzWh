const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

function deleteAllSkuitems(expectedHTTPStatus) {
    it('Deleting data (Not official API)', function (done) {
        agent.delete('/api/skuitems')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    });
}

function deleteAllSkus(expectedHTTPStatus) {
    it('Deleting data (Not official API)', function (done) {
        agent.delete('/api/skus')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    });
}

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

//PUT /api/skuitems/:rfid
function updateSkuitem(expectedHTTPStatus, oldRFID, RFID, Available, DateOfStock){
    it('PUT /api/skuitems/:rfid', function (done){
        let skuitem = {
            newRFID : RFID,
            newAvailable : Available,
            newDateOfStock : DateOfStock,
        }
        agent.put('/api/skuitems/'+oldRFID)
            .send(skuitem)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/skuitems
function getSkuitems(expectedHTTPStatus, expectedJSON){
    it('GET /api/skuitems', function (done){
        agent.get('/api/skuitems') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/skuitems/:rfid
function getSkuitem(expectedHTTPStatus, RFID, expectedJSON){
    it('GET /api/skuitems/:rfid', function (done){
        agent.get('/api/skuitems/'+RFID)
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/skuitems/sku/:id
function getAvailableSkuitem(expectedHTTPStatus, SKUId, expectedJSON){
    it('GET /api/skuitems/sku/:id', function (done){
        agent.get('/api/skuitems/sku/'+SKUId)
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(expectedJSON)
                    res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

//DELETE /api/skuitems/:rfid
function deleteSkuitem(expectedHTTPStatus, RFID){
    it('DELETE /api/skuitems/:rfid', function (done){
        agent.delete('/api/skuitems/'+RFID)
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

describe('Test skuitem APIs', () => {
    deleteAllSkuitems(204);
    deleteAllSkus(204);
    newSku(201,"a new sku",100,50,"first SKU",10.99,50);

    //POST /api/skuitem
    newSkuitem(201,"12345678901234567890123456789014",1,"2021/11/29 12:30");    //New
    newSkuitem(422,"12345678901234567",1,"2021/11/29 12:30");    //Too short rfid
    newSkuitem(422,"",1,"2021/11/29 12:30");    //Empty field
    newSkuitem(422,"12345678901234567890123456789015","2021/11/29 12:30");    //Empty field
    newSkuitem(422,"12345678901234567890123456789015",1,"");    //Empty field
    newSkuitem(422);    //Empty field
    newSkuitem(422,"12345678901234567890123456789014",1,"2021/11/29 :30");    //wrong date format
    newSkuitem(422,"12345678901234567890123456789015",7,"2021/11/29 12");    //wrong date format
    newSkuitem(422,"12345678901234567890123456789015",1,"2021/30/29 12:30");    //wrong date format
    newSkuitem(201,"12345678901234567890123456789015",1,"2021/11/29 12:30");    //New

    //PUT /api/skuitems/:rfid
    updateSkuitem(200,"12345678901234567890123456789014","12345678901234567890123456789014",1,"2021/11/29 12:30"); //available to 1
    updateSkuitem(422,"12345678901234567890123456789014","1234567890123456",1,"2021/11/29 12:30"); //too short id
    updateSkuitem(422,"12345678901234567890123456789014","12345678901234567890123456789014",1,"2021/1/29 12:30"); //wrong date format
    updateSkuitem(422,"12345678901234567890123456789014","12345678901234567890123456789014",1,"2021/11/29 :30"); //wrong date format
    updateSkuitem(422,"12345678901234567890123456789014","12345678901234567890123456789014",1,"2021/29/11 12:30"); //wrong date format
    updateSkuitem(422,"12345678901234567890123456789015","12345678901234567890123456789015",1,""); //Empty field
    updateSkuitem(422,"12345678901234567890123456789014","",1,"2021/11/29 12:30"); //Empty field
    updateSkuitem(200,"12345678901234567890123456789014","12345678901234567890123456789014",0,"2021/11/29 12:30"); //Back to 0
    updateSkuitem(200,"12345678901234567890123456789015","12345678901234567890123456789016",1,"2021/11/30 12:30"); //available to 1, rfid+1 and date+1

    //GET /api/skuitems
    getSkuitems(200,[
        {
            "RFID":"12345678901234567890123456789014",
            "SKUId":1,
            "Available":0,
            "DateOfStock":"2021/11/29 12:30"
        },
        {
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/30 12:30"
        },
    ]
    );

    //GET /api/skuitems/:rfid
    getSkuitem(200, "12345678901234567890123456789016",{
        "RFID":"12345678901234567890123456789016",
        "SKUId":1,
        "Available":1,
        "DateOfStock":"2021/11/30 12:30"
    }); //ok
    getSkuitem(200, "12345678901234567890123456789014",{
        "RFID":"12345678901234567890123456789014",
        "SKUId":1,
        "Available":0,
        "DateOfStock":"2021/11/29 12:30"
    }); //ok
    getSkuitem(404, "12345678901234567890123456789015",{"error":"no skuitem associated to rfid"});

    //GET /api/skuitems/sku/:id
    getAvailableSkuitem(200, 1, [{
        "RFID":"12345678901234567890123456789016",
        "SKUId":1,
        "DateOfStock":"2021/11/30 12:30"
    }]);
    getAvailableSkuitem(404, 2);
    getAvailableSkuitem(422, 0);

    //DELETE /api/skuitems/:rfid
    deleteSkuitem(204, "12345678901234567890123456789016");
    deleteSkuitem(422, "12345678901234567890123456789017");
    getSkuitem(404, "12345678901234567890123456789016",{"error":"no skuitem associated to rfid"});
})