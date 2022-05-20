class RestockOrderDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableRestockOrders(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUE_DATE VARCHAR, STATE VARCHAR, SUPPLIER_ID INTEGER, TRANSPORT_NOTE VARCHAR, PRODUCTS VARCHAR, SKU_ITEMS VARCHAR)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getAllRestockOrders() {
        return new Promise(async (resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDERS'
            let orders = []
            await this.db.all(sql, [], async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                orders = rows.map((r) =>
                    {
                        let order = {
                        id: r.ID,
                        issueDate: r.ISSUE_DATE,
                        state: r.STATE,
                        supplierId: r.SUPPLIER_ID,
                        products: JSON.parse(r.PRODUCTS)
                        }
                        let skuItems = []
                        if (order.state !== 'ISSUED')
                            order.transportNote = JSON.parse(r.TRANSPORT_NOTE)

                        if (order.state === 'ISSUED' || order.state === 'DELIVERY')
                            skuItems = []
                        else{
                            skuItems = JSON.parse(r.SKU_ITEMS)
                        }
                        order.skuItems = skuItems
                        return order

                    });
                resolve(orders)
            })
        })
    }


    getAllRestockOrdersIssued() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDERS WHERE STATE="ISSUED"'
            this.db.all(sql, [], async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                let orders = rows.map((r) =>
                {
                    let order = {
                        id: r.ID,
                        issueDate: r.ISSUE_DATE,
                        state: r.STATE,
                        supplierId: r.SUPPLIER_ID,
                        products: JSON.parse(r.PRODUCTS)
                    }
                    order.skuItems = []
                    return order

                });
                resolve(orders)
            })
        })
    }

    checkIfStored(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(ID) as COUNT FROM RESTOCK_ORDERS WHERE ID = ?'
            this.db.all(sql, [id] , (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const count = rows.map((r) => (
                    r.COUNT
                ));
                resolve(count)
            })
        })
    }


    getRestockOrder(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDERS WHERE ID=' + id
            this.db.get(sql, [], async (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (r === undefined){
                    resolve(undefined);
                    return;
                }

                let order = {
                    issueDate: r.ISSUE_DATE,
                    state: r.STATE,
                    supplierId: r.SUPPLIER_ID,
                    products: JSON.parse(r.PRODUCTS)
                }
                let skuItems = []
                if (order.state !== 'ISSUED')
                    order.transportNote = JSON.parse(r.TRANSPORT_NOTE)

                if (order.state === 'ISSUED' || order.state === 'DELIVERY')
                    skuItems = []
                else{
                    skuItems = JSON.parse(r.SKU_ITEMS)
                }
                order.skuItems = skuItems

                resolve(order)
            })
        })
    }


    addRestockOrder(order){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCK_ORDERS(ISSUE_DATE, SUPPLIER_ID, STATE, PRODUCTS) VALUES (?,?, "ISSUED", ?)'
            this.db.run(sql, [order.issueDate, order.supplierId, JSON.stringify(order.products)] , function(err){
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateRestockOrder(newState, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESTOCK_ORDERS SET STATE = ? WHERE ID = ?'
            this.db.run(sql, [newState, id] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateRestockOrderSKUItems(newSKUitems, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESTOCK_ORDERS SET SKU_ITEMS = ? WHERE ID = ?'
            this.db.run(sql, [JSON.stringify(newSKUitems), id] , async (err) => {
                console.log(id)
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateRestockOrderTransportNote(transportNote, id){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESTOCK_ORDERS SET TRANSPORT_NOTE = ? WHERE ID == ?'
            this.db.run(sql, [JSON.stringify(transportNote), id] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteRestockOrder(id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESTOCK_ORDERS WHERE ID = ?'
            this.db.run(sql, [id] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteRestockOrderData(){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESTOCK_ORDERS'
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true)
            })
        })
    }
    
}

module.exports = RestockOrderDAO;
