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
                    res.text.should.equal('['+JSON.stringify(expectedJSON)+']');
                done();
            })
    })
}
//POST
let sku= {
    description : "a new sku",
    weight : 100,
    volume : 50,
    notes : "first SKU",
    price : 10.99,
    availableQuantity : 50
}


function addItem(expectedHTTPStatus, item){
    it('Adding a new item', function (done){
        agent.post('/api/sku')
        .send(sku)
        .then(
            agent.post('/api/item')
                .send(item)
                .then(function (res){
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })
        )
    })
}

//PUT
function modItem(expectedHTTPStatus, id, modification){
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
        id:1,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    }

    let itemfail = {
        id:3,
        description : "a new item",
        price : 10.99,
        SKUId : 10,
        supplierId : 2
    }
   
    let modbody={
        newDescription : "another item",
        newPrice : 20
        
    }

    //deleteAllData(204);
    dropItemsTable(204);
    addItem(201, item);
    addItem(422);
    addItem(404, itemfail);

    getAllItems(200, item);

    getItem(200, 1, item);
    getItem(404, 20);
    getItem(404);

    
    modItem(200, 1, modbody)
    modItem(404, 30, modbody)
    modItem(422, 1)
    
})


