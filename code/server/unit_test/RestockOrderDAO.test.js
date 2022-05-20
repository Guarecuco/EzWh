/*
const RestockOrderDAO = require('../dao/RestockOrderDAO.js')
const db = new RestockOrderDAO('EzWh')

/!*function RestockOrderModel(id, issue_date, state, supplier_id, products, transport_note, sku_items){
    this.ID =id;
    this.ISSUE_DATE = issue_date;
    this.STATE = state;
    this.SUPPLIER_ID = supplier_id;
    this.PRODUCTS = products;
    this.TRANSPORT_NOTE = transport_note;
    this.SKU_ITEMS = sku_items;
}

const ro1 = new RestockOrderModel(
    1,
    '2021/11/29 09:33',
    'DELIVERED',
    1,
    '[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}]',
    '{"deliveryDate":"2021/12/29"}',
    '[{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]'
)*!/



let RO1 = {
    issueDate: '2021/11/29 09:33',
    supplierId:  1,
    products: [
        {"SKUId":12,"description":"a product","price":10.99,"qty":30},
        {"SKUId":180,"description":"another product","price":11.99,"qty":20}
    ],
}


//test create RO
test('create', async () => {
    RO1.id = await db.addRestockOrder(RO1);
    expect(RO1.id).toBeDefined();
})
//test get by id

//test get all
//test put
//test put
//test put
//test delete

/!*test('read by id', () => {
    expect(db.getRestockOrder(1)).toBe()
})*!/
*/
