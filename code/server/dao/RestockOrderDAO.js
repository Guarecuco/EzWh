class RestockOrderDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableRestockOrders(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUE_DATE VARCHAR, STATE VARCHAR, SUPPLIER_ID INTEGER)';
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
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDERS'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUE_DATE,
                        state: r.STATE,
                        supplierId: r.SUPPLIER_ID               
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getAllRestockOrdersIssued() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDERS WHERE STATE="ISSUED"'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUE_DATE,
                        state: r.STATE,
                        supplierId: r.SUPPLIER_ID               
                    }
                    
                ));
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
            this.db.get(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const order = rows.map((r) => (
                    {
                        issueDate: r.ISSUE_DATE,
                        state: r.STATE,
                        supplierId: r.SUPPLIER_ID               
                    }
                    
                ));
                resolve(order)
            })
        })  
    }

    getReturnableItems(id) {
        return new Promise((resolve, reject) => {
            const sql = ''
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const items = rows.map((r) => (
                    {
                        id: r.ID,
              
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    addRestockOrder(order){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCK_ORDERS(ISSUE_DATE, SUPPLIER_ID, STATE) VALUES (?,?, "ISSUED")'
            this.db.run(sql, [order.issueDate, order.supplierId] , (err) => {
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

    
}

module.exports = RestockOrderDAO;
