const RestockOrderDAO = require('../dao/RestockOrderDAO')
const db = new RestockOrderDAO('EzWh')


/*const RO1 = {
    id: 1,
    issueDate: '2021/11/29 09:33',
    state: 'ISSUED',
    supplierId:  1,
    products: [
        {"SKUId":12,"description":"a product","price":10.99,"qty":30},
        {"SKUId":180,"description":"another product","price":11.99,"qty":20}
    ],
}*/

let RO2 = {
    issueDate: '2021/11/29 09:33',
    state: 'ISSUED',
    supplierId:  1,
    products: [
        {"SKUId":12,"description":"a product","price":10.99,"qty":30},
        {"SKUId":180,"description":"another product","price":11.99,"qty":20}
    ],
    skuItems: []
}

describe("get restock orders", () => {
    beforeEach(async () => {
        await db.deleteRestockOrderData();

        const id = await db.addRestockOrder(RO2);
        RO2.id = id;

    });
    testRestockOrder(RO2);

})

function testRestockOrder(ro){
    test('get restock order', async () => {
        let res = await db.getRestockOrder(ro.id);
        res.products = JSON.parse(JSON.stringify(res.products));
        res.skuItems = JSON.parse(JSON.stringify(res.skuItems));

        expect(res).toEqual({
                issueDate: ro.issueDate,
                state: ro.state,
                supplierId:  ro.supplierId,
                products: ro.products,
                skuItems: ro.skuItems
            }
        )
    })
}
