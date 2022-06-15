class ItemDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableItems(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS ITEMS(id INTEGER PRIMARY KEY, description VARCHAR, price FLOAT , SKUId INTEGER, supplierId INTEGER)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEMS'           //Add condition to check if online
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const items = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        price: r.price,
                        SKUId: r.SKUId,
                        supplierId: r.supplierId
                    }
                    
                ));
                resolve(items)
            })
        })
    }

    countItems(data,sid){
        return new Promise((resolve, reject) => {
           
            const sql = "SELECT COUNT(*) as COUNTED FROM ITEMS WHERE ID = ? AND supplierId = ?"
            this.db.get(sql , [data,sid], (err, row) => {
                
                if(err){
                    reject(err);
                    return;
                }
                const count = row.COUNTED;
               
                resolve(count)
            })
        })
    }

    getItem(id,sid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEMS WHERE id= ? AND supplierId = ?'           //Add condition to check if online
            this.db.all(sql, [id, sid], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const item = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        price: r.price,
                        SKUId: r.SKUId,
                        supplierId: r.supplierId
                    }
                    
                ));
                resolve(item)
            })
        })
    }

    addItem(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEMS(id, description, price, SKUId, supplierId) VALUES (?,?,?,?,?)';
            this.db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateItem(data){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE ITEMS SET description = ?, price = ? WHERE id = ? AND supplierId = ?'
            this.db.run(sql, [data.ndescr, data.nprice, data.nid, data.nsid] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteItem(data,sid){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ITEMS WHERE id = ? AND supplierId = ?'
            this.db.run(sql, [data,sid] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteAllItems(){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ITEMS'
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true)
            })
        })
    }
    dropItemsTable(){
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS ITEMS'
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
module.exports = ItemDAO;