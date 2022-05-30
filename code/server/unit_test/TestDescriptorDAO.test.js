const testDAO = require('../dao/TestDescriptorDAO');
const db = new testDAO('EzWh.db');


function testAddTest(input) {
    test('Create new test', async () => {
        
        await db.addTest(input);
        
        let res = await db.getTestDescriptor(input.id);
        expect(res.name).toStrictEqual(input.name);
        expect(res.procedureDescription).toStrictEqual(input.procedureDescription);
        expect(res.idSKU).toStrictEqual(input.idSKU);
        
    });
}

function testEditTest(input) {
    test('Edit existing test', async () => {

        await db.updateTest(input)
        let res = await db.getTestDescriptor(input.nid);

        expect(res.name).toStrictEqual(input.nname);
        expect(res.procedureDescription).toStrictEqual(input.ndescr);
        expect(res.idSKU).toStrictEqual(input.nsku);
    });
}

function testGetTests(input) {
    test('Retrieving tests', async () => {

        let res = await db.getTestsDescriptors();

        if (res !== undefined){
            expect(res[0].id).toStrictEqual(input.nid);
            expect(res[0].name).toStrictEqual(input.nname);
            expect(res[0].procedureDescription).toStrictEqual(input.ndescr);
            expect(res[0].idSKU).toStrictEqual(input.nsku);
        }
        else{
            expect(res).toStrictEqual([]);
        }
    });
}

function testGetTest(input) {
    test('Retrieving test', async () => {

        
        let res = await db.getTestsDescriptors(input.id);
        if (res !== undefined){
            expect(res.id).toStrictEqual(input.id);
            expect(res.name).toStrictEqual(input.name);
            expect(res.procedureDescription).toStrictEqual(input.procedureDescription);
            expect(res.idSKU).toStrictEqual(input.idSKU);
        }
    });
}

function testFindName(input) {
    test('Retrieving name', async () => {

        
        let res = await db.findTestName(input.name);
        if (res !== undefined){
            expect(res.name).toStrictEqual(input.name);
        }
    });
}

function testIdFromSku(input) {
    test('Retrieving id from sku', async () => {

        
        let res = await db.getSKUDescriptors(input.nsku);
        if (res !== undefined){
            expect(res[0]).toStrictEqual(input.nid);
        }
    });
}




function testDeleteTest(input) {
    test('Delete existing test', async () => {
        
        await db.deleteTest(input);
        
        let res = await db.findTestId(input);

        expect(res).toStrictEqual(0);
    });
}
function testDeleteAllTests(input) {
    test('Delete all tests', async () => {
        
        await db.deleteAllTests();
        
        let res = await db.findTestId(input);

        expect(res).toStrictEqual(0);
    });
}



//************************************************************************** */
//Calling test functions
describe('Test TestDescriptor DAO', () => {
    beforeAll(async () => {
        await db.dropTestsTable();
        await db.newTableTests();
    });

    let test={
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

    let edit={
        nid:1,
        nname: "aggiornamento",
        ndescr: "dei test descriptor",
        nsku: 1
    }

    testAddTest(test);
    testEditTest(edit);
    testGetTests(edit);
    testGetTest(edit);
    testFindName(edit);
    testIdFromSku(edit);
    testDeleteTest(1);
    testAddTest(test2);
    testDeleteAllTests(2);
});
