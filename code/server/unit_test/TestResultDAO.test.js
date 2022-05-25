const testDAO = require('../dao/TestResultDAO');
const db = new testDAO('EzWh.db');


function testAddResult(input) {
    test('Create new result', async () => {
        
        await db.addResult(input);
        
        let res = await db.getSKUResult(input);
        expect(res[0].id).toStrictEqual(input.id);
        expect(res[0].idTestDescriptor).toStrictEqual(input.idTestDescriptor);
        expect(res[0].Date).toStrictEqual(input.Date);
        expect(res[0].Result).toStrictEqual(input.Result);
        
    });
}

function testEditResult(input) {
    test('Edit existing result', async () => {

        await db.updateResult(input)
        let res = await db.getSKUResult(input);

        expect(res[0].idTestDescriptor).toStrictEqual(input.etest);
        expect(res[0].Date).toStrictEqual(input.edate);
        expect(res[0].Result).toStrictEqual(input.eresult);
    });
}

function testGetResultsRfid(input) {
    test('Retrieving results from rfid', async () => {

        let res = await db.getSKUResults(input.rfid);
        
        if (res !== undefined){
            expect(res[0].id).toStrictEqual(input.id);
            expect(res[0].idTestDescriptor).toStrictEqual(input.etest);
            expect(res[0].Date).toStrictEqual(input.edate);
            expect(res[0].Result).toStrictEqual(input.eresult);
        }
        else{
            expect(res).toStrictEqual([]);
        }
    });
}

function testGetResultsRfidId(input) {
    test('Retrieving result from rfid and id', async () => {
        let res = await db.getSKUResult(input);
        
        if (res !== undefined){
            expect(res[0].id).toStrictEqual(input.id);
            expect(res[0].idTestDescriptor).toStrictEqual(input.etest);
            expect(res[0].Date).toStrictEqual(input.edate);
            expect(res[0].Result).toStrictEqual(input.eresult);
        }
        else{
            expect(res).toStrictEqual([]);
        }
    });
}

function countFailed(input) {
    test('Retrieving failed results number', async () => {
        let res = await db.countFailedTest(input.rfid);
        
        if (res !== undefined){
            expect(res[0]).toStrictEqual(1);
        }
        else{
            expect(res).toStrictEqual([]);
        }
    });
}

function testDeleteResult(input) {
    test('Delete existing test', async () => {
        
        await db.deleteResult(input);
        
        let res = await db.getSKUResult(input);
        expect(JSON.stringify(res)).toStrictEqual(JSON.stringify([]));
    });
}

function testDeleteAllResults(input) {
    test('Delete all results', async () => {
        
        await db.deleteAllResults();
        
        let res = await db.getSKUResult(input);
        expect(JSON.stringify(res)).toStrictEqual(JSON.stringify([]));
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
    let result2={
        id:2,
        rfid:"12345678901234567890123456789016",
        idTestDescriptor:1,
        Date:"2021/11/28",
        Result: true
}
    let edit= {
        id:1,
        rfid:"12345678901234567890123456789016",
        etest:1,
        edate:"2021/11/29",
        eresult: true
    }


    testAddResult(result);
    testEditResult(edit);
    testGetResultsRfid(edit);
    testGetResultsRfidId(edit);
    testDeleteResult(edit);
    testAddResult(result2);
    countFailed(result2);
    testDeleteAllResults(result2);
});
