class ReturnOrderDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableReturnOrders(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RETURN_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, RETURN_DATE VARCHAR, PRODUCTS VARCHAR, RESTOCK_ORDER_ID INTEGER)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    checkIfRestockOrderExists(id){
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

    getReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURN_ORDERS'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        returnDate: r.RETURN_DATE,
                        restockOrderId: r.RESTOCK_ORDER_ID                     
                    }
                    
                ));
                resolve(orders)
            })
        })
    }

    getReturnOrder(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RETURN_ORDERS WHERE ID=' + id
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
                    returnDate: r.RETURN_DATE,
                    products: JSON.parse(r.PRODUCTS),
                    restockOrderId: r.RESTOCK_ORDER_ID
                }
                resolve(order)
            })
        })
    }

    addReturnOrder(order){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURN_ORDERS(RETURN_DATE, PRODUCTS, RESTOCK_ORDER_ID) VALUES (?,?,?)'
            this.db.run(sql, [order.returnDate, JSON.stringify(order.products), order.restockOrderId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }


    deleteReturnOrder(id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RETURN_ORDERS WHERE ID = ?'
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

module.exports = ReturnOrderDAO;
