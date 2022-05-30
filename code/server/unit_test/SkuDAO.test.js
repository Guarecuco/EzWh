const SkuDAO = require('../dao/SkuDAO.js')
const db = new SkuDAO('EzWh.db')
const TestDescriptorDAO = require('../dao/TestDescriptorDAO.js')
const dbt = new TestDescriptorDAO('EzWh.db')

function testgetSku(id,input) {
    test('test the getSku', async () => {
        let res = (await db.getSku(id))[0];

        expect(res).toEqual(input);
    });
}
function testgetSkus(input) {
    test('test the getSku', async () => {
        let res = (await db.getStoredSkus())[0];

        expect(res).toEqual(input);
    });
}
function testdeleteSku(id) {
    test('test the deleteSku', async () => {
        await db.deleteSku(id);
        let res = await db.getStoredSkus();

        expect(res).toEqual([]);
    });
}
function testcountSku(id,input) {
    test('test the countSku', async () => {
        let res = await db.countSku(id);

        expect(res).toEqual(1);
    });
}

let test1={
    id:1,
    name: "prova",
    procedureDescription: "dei test descriptor",
    idSKU: 1
}
let test2={
    id:2,
    name: "prova 2",
    procedureDescription: "dei test descriptor 2",
    idSKU: 1
}

let newSku = {
    description : "a new sku",
    weight : 100,
    volume : 50,
    notes : "first SKU",
    price : 10.99,
    availableQuantity : 50
}

let testget = {
    description : "a good sku",
    weight : 50,
    volume : 100,
    notes : "first SKU",
    price : 10.99,
    availableQuantity : 60,
    position : "800234523412",
    testDescriptors : [1,2]
}

let testgets = {
    id : 1,
    description : "a good sku",
    weight : 50,
    volume : 100,
    notes : "first SKU",
    price : 10.99,
    availableQuantity : 60,
    position : "800234523412",
    testDescriptors : [1,2]
}

let testupdate = {
    newDescription : "a good sku",
    newWeight : 50,
    newVolume : 100,
    newNotes : "first SKU",
    newPrice : 10.99,
    newAvailableQuantity : 50
}


describe('Test Sku DAO', () => {
    beforeEach(async function () {
        await db.deleteAllSkus();
        await db.newTableSku();
        await db.storeSku(newSku);
        await dbt.dropTestsTable();
        await dbt.newTableTests();
        await dbt.addTest(test1);
        await dbt.addTest(test2);
        await db.updateSku(1,testupdate);
        await db.setAvailableQuantityById(1,60);
        await db.setPosition(1,"800234523412");
    });

    testgetSkus(testgets);
    testgetSku(1,testget);
    testcountSku(1,1);
    testdeleteSku(1);
})