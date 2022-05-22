const testDao = require('../dao/TestDescriptorDAO');

describe('testDao', () => {
    beforeAll(async () => {
        await testDao.deleteAllTests();
    });

    test('delete db', async () => {
        var res = await testDao.getTestsDescriptors();
        expect(res.length).toStrictEqual(0);
    });
    let atest = {
        name: 'rig everything',
        procedureDescription:  'What a beautiful test',
        idSKU: 1
    }
    testAddTest(atest);
});

function testAddTest(input) {
    test('create new test', async () => {
        
        await testDao.addTest(input);
        
        var res = await testDao.getAllUsers();
        expect(res.length).toStrictEqual(1);
        
        res = await testDao.getTestDescriptor(1);

        expect(res.name).toStrictEqual(test.name);
        expect(res.procedureDescription).toStrictEqual(test.procedureDescription);
        expect(res.idSKU).toStrictEqual(test.idSKU);
    });
}
