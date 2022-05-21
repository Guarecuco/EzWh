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
    it('GET /api/suppliers', function (done){
        agent.get('/api/suppliers') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

//GET /api/users
function getUsers(expectedHTTPStatus, expectedJSON){
    it('GET /api/users', function (done){
        agent.get('/api/users') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            })
    })
}

//POST /api/newUser
function newUser(expectedHTTPStatus, username, name, surname, password, type){
    it('POST /api/newUser', function (done){
        let user = {
            username: username,
            name: name,
            surname: surname,
            password: password,
            type: type
        }
        agent.post('/api/newUser')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    })
}

//POST /api/managerSessions
function managerSessions(expectedHTTPStatus,expectedJSON, username, password){
    it('POST /api/managerSessions', function (done){
        let user = {
            username: username,
            password: password
        }
        agent.post('/api/managerSessions')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }                
                done();
            })
    })
}

//POST /api/customerSessions
function customerSessions(expectedHTTPStatus,expectedJSON, username, password){
    it('POST /api/customerSessions', function (done){
        let user = {
            username: username,
            password: password
        }
        agent.post('/api/customerSessions')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }              
                done();
            })
    })
}

//POST /api/supplierSessions
function supplierSessions(expectedHTTPStatus,expectedJSON, username, password){
    it('POST /api/supplierSessions', function (done){
        let user = {
            username: username,
            password: password
        }
        agent.post('/api/supplierSessions')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }              
                done();
            })
    })
}

//POST /api/clerkSessions
function clerkSessions(expectedHTTPStatus,expectedJSON, username, password){
    it('POST /api/clerkSessions', function (done){
        let user = {
            username: username,
            password: password
        }
        agent.post('/api/clerkSessions')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }              
                done();
            })
    })
}

//POST /api/qualityEmployeeSessions
function qualityEmployeeSessions(expectedHTTPStatus,expectedJSON, username, password){
    it('POST /api/qualityEmployeeSessions', function (done){
        let user = {
            username: username,
            password: password
        }
        agent.post('/api/qualityEmployeeSessions')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }              
                done();
            })
    })
}

//POST /api/deliveryEmployeeSessions
function deliveryEmployeeSessions(expectedHTTPStatus,expectedJSON, username, password){
    it('POST /api/deliveryEmployeeSessions', function (done){
        let user = {
            username: username,
            password: password
        }
        agent.post('/api/deliveryEmployeeSessions')
            .send(user)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                if(res.status == 200){
                    res.text.should.equal(JSON.stringify(expectedJSON));
                }              
                done();
            })
    })
}

//POST /api/logout
//Not to be implemented yet

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



describe('Test user APIs', () => {
    dropUsers(204);

    newUser(201,"user1@ezwh.com", "Milton","Carman","testpassword","customer");    //New
    newUser(201,"supplier1@ezwh.com", "Margaret","Ford","testpassword","supplier");    //New supplier
    newUser(201,"supplier2@ezwh.com", "Ferne","Hayter","testpassword","supplier");    //New supplier
    newUser(201,"qualityEmployee1@ezwh.com", "Ardath","Hancock","testpassword","qualityEmployee");  //New qualityEmployee
    newUser(201,"clerk1@ezwh.com", "Seth","Deering","testpassword","clerk");      //New clerk
    newUser(201,"deliveryEmployee1@ezwh.com", "Agnes","Morse","testpassword","deliveryEmployee");  //New deliveryEmployee
    newUser(409,"user1@ezwh.com", "Charles","Smith","testpassword","customer");    //Email already exists
    newUser(409,"supplier1@ezwh.com", "John","Brown","testpassword","supplier"); //Emali already exists
    newUser(422,"manager1@ezwh.com", "Luca","Ardito","testpassword","manager");  //New Manager - Not possible
    newUser(422,"employee@ezwh.com", "Alessio","Rossi","testpassword","employee");  //Wrong type
    newUser(422,"user2@ezwh.com", "Valentino","Ferrari","pass","customer");    //Short password
    newUser(422,"user3@ezwh.com", "Juan","Garcia","testpassword");       //Missing type
    newUser(422,"user4@ezwh.com", "","Gonzalez","testpassword");           //Empty Name
    newUser(422);                                                       //Missing body

    getSuppliers(200,[
        {
            "id": 2,
            "name": "Margaret",
            "surname": "Ford",
            "email": "supplier1@ezwh.com"
        },
        {
            "id": 3,
            "name": "Ferne",
            "surname": "Hayter",
            "email": "supplier2@ezwh.com"
        }
    ]);
    
    getUsers(200,[
        {
            "id": 1,
            "name": "Milton",
            "surname": "Carman",
            "email": "user1@ezwh.com",
            "type": "customer"
        },
        {
            "id": 2,
            "name": "Margaret",
            "surname": "Ford",
            "email": "supplier1@ezwh.com",
            "type": "supplier"
        },
        {
            "id": 3,
            "name": "Ferne",
            "surname": "Hayter",
            "email": "supplier2@ezwh.com",
            "type": "supplier"
        },
        {
            "id": 4,
            "name": "Ardath",
            "surname": "Hancock",
            "email": "qualityEmployee1@ezwh.com",
            "type": "qualityEmployee"
        },
        {
            "id": 5,
            "name": "Seth",
            "surname": "Deering",
            "email": "clerk1@ezwh.com",
            "type": "clerk"
        },
        {
            "id": 6,
            "name": "Agnes",
            "surname": "Morse",
            "email": "deliveryEmployee1@ezwh.com",
            "type": "deliveryEmployee"
        }
    ]);

    //managerSessions(200,{"id": 2,"username": "supplier1@ezwh.com","name": "Margaret"},"supplier1@ezwh.com","testpassword");  //OK
    //managerSessions(401,"","supplier1@ezwh.com","wrongpassword");          //Wrong password
    //managerSessions(401,"","user1@ezwh.com","testpassword");           //Not supplier user
    //managerSessions(500,"","","testpassword");                         //Empty field
    //managerSessions(500,"");                                           //Empty body

    customerSessions(200,{"id": 1,"username": "user1@ezwh.com","name": "Milton"},"user1@ezwh.com","testpassword");  //OK
    customerSessions(401,"","user1@ezwh.com","wrongpassword");          //Wrong password
    customerSessions(401,"","supplier1@ezwh.com","testpassword");       //Not customer user
    customerSessions(500,"","","testpassword");                         //Empty field
    customerSessions(500,"");                                           //Empty body

    supplierSessions(200,{"id": 2,"username": "supplier1@ezwh.com","name": "Margaret"},"supplier1@ezwh.com","testpassword");  //OK
    supplierSessions(401,"","supplier1@ezwh.com","wrongpassword");          //Wrong password
    supplierSessions(401,"","user1@ezwh.com","testpassword");           //Not supplier user
    supplierSessions(500,"","","testpassword");                         //Empty field
    supplierSessions(500,"");                                           //Empty body

    clerkSessions(200,{"id": 5,"username": "clerk1@ezwh.com","name": "Seth"},"clerk1@ezwh.com","testpassword");  //OK
    clerkSessions(401,"","clerk1@ezwh.com","wrongpassword");          //Wrong password
    clerkSessions(401,"","user1@ezwh.com","testpassword");           //Not supplier user
    clerkSessions(500,"","","testpassword");                         //Empty field
    clerkSessions(500,"");                                           //Empty body

    qualityEmployeeSessions(200,{"id": 4,"username": "qualityEmployee1@ezwh.com","name": "Ardath"},"qualityEmployee1@ezwh.com","testpassword");  //OK
    qualityEmployeeSessions(401,"","qualityEmployee1@ezwh.com","wrongpassword");          //Wrong password
    qualityEmployeeSessions(401,"","user1@ezwh.com","testpassword");           //Not supplier user
    qualityEmployeeSessions(500,"","","testpassword");                         //Empty field
    qualityEmployeeSessions(500,"");                                           //Empty body

    deliveryEmployeeSessions(200,{"id": 6,"username": "deliveryEmployee1@ezwh.com","name": "Agnes"},"deliveryEmployee1@ezwh.com","testpassword");  //OK
    deliveryEmployeeSessions(401,"","deliveryEmployee1@ezwh.com","wrongpassword");          //Wrong password
    deliveryEmployeeSessions(401,"","user1@ezwh.com","testpassword");           //Not supplier user
    deliveryEmployeeSessions(500,"","","testpassword");                         //Empty field
    deliveryEmployeeSessions(500,"");                                           //Empty body

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