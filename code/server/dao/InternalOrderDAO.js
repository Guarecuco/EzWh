class InternalOrderDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }

    newTableInternalOrders(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS INTERNAL_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE DATE, STATE VARCHAR, CUSTOMERID INTEGER)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    newTableInternalOrdersProducts(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS INTERNAL_ORDERS_PRODUCTS(ID INTEGER PRIMARY KEY AUTOINCREMENT, SKUID INTEGER, DESCRIPTION VARCHAR, PRICE FLOAT, QTY INTEGER, RFID VARCHAR, ORDERID INTEGER)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    storeInternalOrder(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INTERNAL_ORDERS(ISSUEDATE,STATE,CUSTOMERID) VALUES (?,?,?)'
            this.db.run(sql, [data.issueDate, data.state, data.customerId] , function (err) {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    storeInternalOrderProducts(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INTERNAL_ORDERS_PRODUCTS(SKUID, DESCRIPTION, PRICE, QTY, ORDERID) VALUES (?,?,?,?,?)'
            this.db.run(sql, [data.SKUId, data.description, data.price, data.qty, data.orderId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    checkIfOrderExists(data){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(ID) as COUNT FROM INTERNAL_ORDERS WHERE ID = ?'
            this.db.all(sql, [data.orderId] , (err, rows) => {
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

    updateInternalOrder(data){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE INTERNAL_ORDERS SET STATE = ? WHERE ID = ?'
            this.db.run(sql, [data.newState, data.orderId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateInternalOrderProducts(data){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE INTERNAL_ORDERS_PRODUCTS SET RFID = ? WHERE ORDERID = ? AND SKUId = ?'
            this.db.run(sql, [data.RFID, data.orderId, data.SKUId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteInternalOrder(data){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM INTERNAL_ORDERS WHERE ID = ?'
            this.db.run(sql, [data.orderId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteInternalOrderProducts(data){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM INTERNAL_ORDERS_PRODUCTS WHERE ORDERID = ?'
            this.db.run(sql, [data.orderId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getInternalOrdersProducts(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS_PRODUCTS WHERE ORDERID = ?'
            this.db.all(sql, [data.id], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        qty: r.QTY
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getInternalOrdersProductsCompleted(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS_PRODUCTS WHERE ORDERID = ?'
            this.db.all(sql, [data.id], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        SKUId: r.SKUID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        RFID: r.RFID
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getInternalOrdersIssued() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS WHERE STATE = "ISSUED"' 
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getInternalOrdersAccepted() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS WHERE STATE = "ACCEPTED"' 
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getInternalOrdersbyID(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM INTERNAL_ORDERS WHERE ID = ?'
            this.db.all(sql, [data.orderId], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        customerId: r.CUSTOMERID
                    }
                    
                ));
                resolve(orders)
            })
        })
    }
};

module.exports = InternalOrderDAO;