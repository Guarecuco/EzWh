const SkuitemDAO = require('../dao/SkuitemDAO.js')
const db = new SkuitemDAO('EzWh.db')

function testgetSkuitem(id,input) {
    test('test the getSku', async () => {
        let res = (await db.getStoredSkuitem(id))[0];

        expect(res).toEqual(input);
    });
}
function testgetSkuitems(input) {
    test('test the getSkuitems', async () => {
        let res = (await db.getStoredSkuitems())[0];

        expect(res).toEqual(input);
    });
}
function testgetAvailableSkuitem(id,input) {
    test('test the getAvailableSku', async () => {
        let res = (await db.getAvailableSkuitems(id))[0];

        expect(res).toEqual(input);
    });
}
function testdeleteSkuitem(id) {
    test('test the deleteSku', async () => {
        await db.deleteSkuitem(id)
        let res = await db.getAvailableSkuitems(id);
        expect(res).toEqual([]);
    });
}

newSkuitem = {
    RFID:"12345678901234567890123456789015",
    SKUId:1,
    DateOfStock:"2021/11/29 12:30"
}

updateSkuitem = {
    newRFID:"12345678901234567890123456789016",
    newAvailable:0,
    newDateOfStock:"2021/11/30 12:30"
}

testgets = {
    RFID:"12345678901234567890123456789016",
    SKUId:1,
    Available:1,
    DateOfStock:"2021/11/30 12:30",
}

testgetbysku = {
    RFID:"12345678901234567890123456789016",
    SKUId:1,
    DateOfStock:"2021/11/30 12:30"
}

describe('Test Skuitem DAO', () => {
    beforeEach(async function () {
        await db.deleteSkuitems();
        await db.newTableSkuitem();
        await db.storeSkuitem(newSkuitem);
        await db.updateSkuitem("12345678901234567890123456789015",updateSkuitem);
        await db.setAvailabilityByRFID("12345678901234567890123456789016",1);
    });

    testgetSkuitems(testgets);
    testgetSkuitem("12345678901234567890123456789016",testgets);
    testgetAvailableSkuitem(1,testgetbysku);
    testdeleteSkuitem("12345678901234567890123456789016");
})