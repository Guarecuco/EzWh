class ReturnOrderDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableReturnOrders(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RETURN_ORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, RETURN_DATE VARCHAR, RESTOCK_ORDER_ID INTEGER)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
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

    

    
}

module.exports = ReturnOrderDAO;