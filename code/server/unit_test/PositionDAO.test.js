const PositionDAO = require('../dao/PositionDAO.js')
const db = new PositionDAO('EzWh.db')

function testUpdatePosition(id, input) {
    test('update the informations about a position', async () => {
        await db.updatePositionID(id,input);
        let res = (await db.getStoredPositions())[0];

        expect(res.positionID).toStrictEqual(input.newAisleID+input.newRow+input.newCol);
        expect(res.aisleID).toStrictEqual(input.newAisleID);
        expect(res.row).toStrictEqual(input.newRow);
        expect(res.col).toStrictEqual(input.newCol);
        expect(res.maxWeight).toStrictEqual(input.newMaxWeight);
        expect(res.maxVolume).toStrictEqual(input.newMaxVolume);
        expect(res.occupiedWeight).toStrictEqual(input.newOccupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(input.newOccupiedVolume);
    });
}

function testChangePosition(id, input) {
    test('change the positionID about a position', async () => {

        await db.changePositionID(id,input.positionID);
        let res = (await db.getStoredPositions())[0];

        expect(res.positionID).toStrictEqual(input.positionID);
        expect(res.aisleID).toStrictEqual(input.aisleID);
        expect(res.row).toStrictEqual(input.row);
        expect(res.col).toStrictEqual(input.col);
    });
}

function testUpdateDimensions(volume, weight, availableQuantity, update, pos, ok) {
    test('update the dimensions of a position', async () => {
        try{
            await db.updatePositionID(pos.positionID,update);
            await db.updateDimensions(volume, weight, availableQuantity, pos);
        }catch{}
        
        let res = (await db.getStoredPositions())[0];

        if(ok){
            expect(res.occupiedWeight).toStrictEqual(pos.occupiedWeight+weight*availableQuantity);
            expect(res.occupiedVolume).toStrictEqual(pos.occupiedVolume+volume*availableQuantity);
        }
        else{
            expect(res.occupiedWeight).toStrictEqual(pos.occupiedWeight)
            expect(res.occupiedVolume).toStrictEqual(pos.occupiedVolume);
        }
    });
}

let newPosition = {
    positionID:"800234543412",
    aisleID: "8002",
    row: "3454",
    col: "3412",
    maxWeight: 1000,
    maxVolume: 1000
}

let updatePosition = {
    newAisleID: "8002",
    newRow: "3454",
    newCol: "3412",
    newMaxWeight: 1200,
    newMaxVolume: 600,
    newOccupiedWeight: 200,
    newOccupiedVolume:100
}

let positionIDCheck = {
    positionID:"123456789123",
    aisleID: "1234",
    row: "5678",
    col: "9123",
}

let positionDimensionsCheck = {
    positionID:"800234543412",
    aisleID: "8002",
    row: "3454",
    col: "3412",
    maxWeight: 1200,
    maxVolume: 600,
    occupiedWeight: 200,
    occupiedVolume: 100
}

describe('Test Position DAO', () => {
    beforeEach(async function () {
        await db.deleteAllPositions();
        await db.newTablePosition();
        await db.storePosition(newPosition);
    });

    testUpdatePosition(newPosition.positionID,updatePosition);
    testChangePosition(newPosition.positionID,positionIDCheck);
    //volume,weight,quantity
    testUpdateDimensions(10, 10, 10, updatePosition, positionDimensionsCheck, true);
    testUpdateDimensions(50, 100, 10, updatePosition, positionDimensionsCheck, true);
    testUpdateDimensions(0, 0, 0, updatePosition, positionDimensionsCheck, false);
    testUpdateDimensions(51, 100, 10, updatePosition, positionDimensionsCheck, false);
    testUpdateDimensions(50, 101, 10, updatePosition, positionDimensionsCheck, false);
})