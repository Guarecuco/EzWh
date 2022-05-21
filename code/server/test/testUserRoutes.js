const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

// Delete all user NOT official API
function dropUsers(expectedHTTPStatus){
    it('Deleting all users (Not official API)', function ( done){
        agent.delete('/api/users')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//GET /api/userinfo
//Not to be implemented yet

//GET /api/suppliers
function getSuppliers(expectedHTTPStatus, expectedJSON){
    console.log(expectedJSON)
    it('GET /api/suppliers', function (done){
        agent.get('/api/suppliers') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                console.log(res.body[0]);
                res.body[0].should.have.property.json(expectedJSON);
                done();
            })
    })
}

//POST /api/newUser
function newUser(expectedHTTPStatus, username, name, surname, password, type){
    it('POST /api/newUser', function (done){
        let user = {
            username:username,
            name:name,
            surname : surname,
            password : password,
            type : type
        }
        agent.post('/api/newUser')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//PUT /api/users/:username
function editUser(expectedHTTPStatus, username, oldType, newType){
    it('PUT /api/users/:username', function (done){
        let body = {
            oldType:oldType,
            newType:newType
        }
        agent.put('/api/users/'+username)
            .send(body)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//DELETE /api/users/:username/:type
function deleteUser(expectedHTTPStatus, username,type){
    it('DELETE /api/users/:username/:type', function (done){
        agent.delete('/api/users/'+username+'/'+type)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}


let expectedSuppliers = {
    id: 2,
    name: 'John',
    surname: 'Smith',
    email: 'supplier1@ezwh.com',
    type: 'supplier'
  }




describe('Test user APIs', () => {
    dropUsers(204);

    newUser(201,"user1@ezwh.com", "John","Smith","testpassword","customer");    //New
    newUser(201,"supplier1@ezwh.com", "John","Smith","testpassword","supplier");    //New supplier
    newUser(201,"qualityEmployee1@ezwh.com", "John","Smith","testpassword","qualityEmployee");  //New qualityEmployee
    newUser(201,"clerk1@ezwh.com", "John","Smith","testpassword","clerk");      //New clerk
    newUser(201,"deliveryEmployee1@ezwh.com", "John","Smith","testpassword","deliveryEmployee");  //New deliveryEmployee
    newUser(409,"user1@ezwh.com", "John","Smith","testpassword","customer");    //User exists
    newUser(409,"supplier1@ezwh.com", "John","Smith","testpassword","supplier"); //User exists
    newUser(422,"manager1@ezwh.com", "John","Smith","testpassword","manager");  //New Manager - Not possible
    newUser(422,"employee@ezwh.com", "John","Smith","testpassword","employee");  //Wrong type
    newUser(422,"user2@ezwh.com", "John","Smith","pass","customer");    //Short password
    newUser(422,"user3@ezwh.com", "John","Smith","testpassword");       //Missing type
    newUser(422,"user4@ezwh.com", "","Smith","testpassword");           //Empty Name
    newUser(422);                                                       //Missing body

    //getSuppliers(200,expectedSuppliers);
    
    editUser(200,"user1@ezwh.com","customer","supplier");               //User exist
    editUser(200,"user1@ezwh.com","supplier","customer");               //Change back to customer
    editUser(404,"test@ezwh.com","customer","supplier");               //User doesnt exist
    editUser(404,"user1@ezwh.com","supplier","employee");               //Wrong type
    editUser(422,"user1@ezwh.com","supplier","manager");                //Manager is not allowed
    editUser(422,"user1@ezwh.com","customer");                         //Empty field
    editUser(422,"user1@ezwh.com");                                     //Empty body
    editUser(422)                                                       //Empty request

    deleteUser(204,"clerk1@ezwh.com","clerk")                           //OK
    deleteUser(204,"deliveryEmployee1@ezwh.com","deliveryEmployee")     //OK
    deleteUser(422,"qualityEmployee1@ezwh.com","clerk")                 //Wrong type
    deleteUser(422,"manager1@ezwh.com","manager")                       //Manager type
    deleteUser(422,"qualityEmployee1@ezwh.com")                         //Missing type
    
    //deleteAllUsers(204);
})