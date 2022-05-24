const testDAO = require('../dao/ItemDAO');
const db = new testDAO('EzWh.db');


function testAddItem(input) {
    test('Create new item', async () => {
        
        await db.addItem(input);
        
        let res = await db.getItem(input.id);
        expect(res[0].id).toStrictEqual(input.id);
        expect(res[0].description).toStrictEqual(input.description);
        expect(res[0].price).toStrictEqual(input.price);
        expect(res[0].SKUId).toStrictEqual(input.SKUId);
        expect(res[0].supplierId).toStrictEqual(input.supplierId);
        
    });
}

function testEditItem(input) {
    test('Edit existing item', async () => {

        await db.updateItem(input)
        let res = await db.getItem(1);
        expect(res[0].nid).toStrictEqual(input.id);
        expect(res[0].ndescr).toStrictEqual(input.description);
        expect(res[0].nprice).toStrictEqual(input.price);
        expect(res[0].SKUId).toStrictEqual(input.SKUId);
        expect(res[0].supplierId).toStrictEqual(input.supplierId);
        
    });
}

function testGetItems(input) {
    test('Retrieving items', async () => {

        let res = await db.getItems();

        if (res !== undefined){
            expect(res[0].nid).toStrictEqual(input.id);
            expect(res[0].ndescr).toStrictEqual(input.description);
            expect(res[0].nprice).toStrictEqual(input.price);
            expect(res[0].SKUId).toStrictEqual(input.SKUId);
            expect(res[0].supplierId).toStrictEqual(input.supplierId);
        }
        else{
            expect(res).toStrictEqual([]);
        }
    });
}

function testGetItem(input) {
    test('Retrieving item', async () => {

        
        let res = await db.getItems();

        if (res !== undefined){
            expect(res[0].nid).toStrictEqual(input.id);
            expect(res[0].ndescr).toStrictEqual(input.description);
            expect(res[0].nprice).toStrictEqual(input.price);
            expect(res[0].SKUId).toStrictEqual(input.SKUId);
            expect(res[0].supplierId).toStrictEqual(input.supplierId);
        }
        else{
            expect(res).toStrictEqual([]);
        }
    });
}



function testDeleteItem(input) {
    test('Delete existing item', async () => {
        
        await db.deleteItem(input);
        
        let res = await db.countItems(input);

        expect(res).toStrictEqual(0);
    });
}

function testDeleteAllItems(input) {
    test('Delete existing item', async () => {
        
        await db.deleteAllItems();
        
        let res = await db.countItems(input);

        expect(res).toStrictEqual(0);
    });
}



//************************************************************************** */
//Calling test functions
describe('Test TestDescriptor DAO', () => {
    beforeAll(async () => {
        await db.dropItemsTable();
        await db.newTableItems();
    });

    let item=    {
        id : 1,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    }
    let item2=    {
        id : 2,
        description : "a new item",
        price : 11.99,
        SKUId : 1,
        supplierId : 2
    }

    let edit={
        nid : 1,
        ndescr : "a edited item",
        nprice : 10.99,
        SKUId : 1,
        supplierId : 2
    }

    testAddItem(item);
    testEditItem(edit);
    testGetItems(edit);
    testGetItem(edit);
    testDeleteItem(1);
    testAddItem(item2);
    testDeleteAllItems(item2);
});
