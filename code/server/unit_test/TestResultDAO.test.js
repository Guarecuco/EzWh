const testDAO = require('../dao/TestResultDAO');
const db = new testDAO('EzWh.db');


function testAddResult(input) {
    test('Create new result', async () => {
        
        await db.addResult(input);
        
        let res = await db.getSKUResult(input);
        console.log(res);
        expect(res[0].id).toStrictEqual(input.id);
        expect(res[0].idTestDescriptor).toStrictEqual(input.idTestDescriptor);
        expect(res[0].Date).toStrictEqual(input.Date);
        expect(res[0].Result).toStrictEqual(input.Result);
        
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



function testDeleteTest(input) {
    test('Delete existing test', async () => {
        
        await db.deleteTest(input);
        
        let res = await db.findTestId(input);

        expect(res).toStrictEqual(0);
    });
}



//************************************************************************** */
//Calling test functions
describe('Test TestResult DAO', () => {
    beforeAll(async () => {
        await db.dropResultsTable();
        await db.newResultTests();
    });

    let result={
            id:1,
            rfid:"12345678901234567890123456789016",
            idTestDescriptor:1,
            Date:"2021/11/28",
            Result: true
    }

    let edit={
        nid:1,
        nname: "aggiornamento",
        ndescr: "dei test descriptor",
        nsku: 1
    }

    testAddResult(result);
   /* testEditTest(edit);
    testGetTests(edit);
    testGetTest(edit);
    testDeleteTest(1);*/
});
