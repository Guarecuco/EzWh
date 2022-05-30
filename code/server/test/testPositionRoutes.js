const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);


function deleteAllPositions(expectedHTTPStatus) {
    it('Deleting data (Not official API)', function (done) {
        agent.delete('/api/position')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    });
}

//POST /api/position
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

//PUT /api/position/:positionID
function updatePosition(expectedHTTPStatus, positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume){
    it('PUT /api/position/:positionID', function (done){
        let pos = {
            newAisleID: newAisleID,
            newRow: newRow,
            newCol: newCol,
            newMaxWeight: newMaxWeight,
            newMaxVolume: newMaxVolume,
            newOccupiedWeight: newOccupiedWeight,
            newOccupiedVolume: newOccupiedVolume
        }

        agent.put('/api/position/'+positionID)
            .send(pos)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

// PUT /api/position/:positionID/changeID
function updatePositionID(expectedHTTPStatus, positionID, newPositionID){
    it('PUT /api/position/:positionID/changeID', function (done){
        let pos = {
            newPositionID: newPositionID,
        }

        agent.put('/api/position/'+positionID+'/changeID')
            .send(pos)    
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

//GET /api/positions
function getPositions(expectedHTTPStatus, expectedJSON){
    it('GET /api/positions', function (done){
        agent.get('/api/positions') 
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                res.text.should.equal(JSON.stringify(expectedJSON));
                done();
            }).catch((err)=>console.log(err));
    })
}

//DELETE /api/position/:positionID
function deletePosition(expectedHTTPStatus, positionID){
    it('DELETE /api/position/:positionID', function (done){
        agent.delete('/api/position/'+positionID)
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>console.log(err));
    })
}

describe('Test Positions APIs', () => {
    deleteAllPositions(204);

    //POST /api/position
    newPosition(201,"800234543412","8002","3454","3412",1000,1000); //new
    newPosition(422,"800234543411","8002","3454","3412",1000,1000); //wrong id
    newPosition(422,"700234543412","8002","3454","3412",1000,1000); //wrong id
    newPosition(422,"800294543412","8002","3454","3412",1000,1000); //wrong id
    newPosition(422,"800234543411","8002","3454","3412",0,1000); //no space
    newPosition(422,"800234543411","8002","3454","3412",1000,0); //no space
    newPosition(201,"801234543412","8012","3454","3412",1000,1000); //new
    

    //PUT /api/position/:positionID
    updatePosition(200,"800234543412","8002","3454","3412",1200,600,200,100); //update dimensions
    updatePosition(200,"801234543412","8022","3454","3412",1000,1000,0,0); //update isle
    updatePosition(200,"802234543412","8022","9454","3412",1000,1000,0,0); //update row
    updatePosition(200,"802294543412","8022","9454","6412",1000,1000,0,0); //update col
    updatePosition(404,"111111111111","8002","3454","3412",1200,600,200,100); //wrong id
    updatePosition(422,"800234543412","8002","3454","3412",1200,600,1300,700); //wrong dimensions

    // PUT /api/position/:positionID/changeID
    updatePositionID(200,"800234543412","800234541111"); //update id
    updatePositionID(404,"800234543412","800234541111"); //wrong id
    updatePositionID(422,"800234543412",""); //wrong id

    //GET /api/positions
    getPositions(200,[
        {
            "positionID":"800234541111",
            "aisleID": "8002",
            "row": "3454",
            "col": "1111",
            "maxWeight": 1200,
            "maxVolume": 600,
            "occupiedWeight": 200,
            "occupiedVolume":100
        },
        {
            "positionID":"802294546412",
            "aisleID": "8022",
            "row": "9454",
            "col": "6412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 0,
            "occupiedVolume":0
        },
    ]);

    //DELETE /api/position/:positionID
    deletePosition(204, "800234541111");
    deletePosition(422, "111111111111");
    getPositions(200,[
        {
            "positionID":"802294546412",
            "aisleID": "8022",
            "row": "9454",
            "col": "6412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 0,
            "occupiedVolume":0
        },
    ]);
    
})