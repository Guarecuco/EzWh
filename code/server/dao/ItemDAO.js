class ItemDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableItems(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS ITEMS(id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR, price FLOAT , SKUId INTEGER, supplierId INTEGER';
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
                        idSKU: r.SKUId,
                        supplierId: r.supplierId
                    }
                    
                ));
                resolve(items)
            })
        })
    }

    getItem(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEMS WHERE id= ?'           //Add condition to check if online
            this.db.all(sql, [id], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const item = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        price: r.price,
                        idSKU: r.SKUId,
                        supplierId: r.supplierId
                    }
                    
                ));
                resolve(item)
            })
        })
    }
//-----------------------------
    findTestName(data){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNT FROM TESTS WHERE NAME = ?"
            this.db.all(sql , data, (err, rows) => {
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

    findTestId(data){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNT FROM TESTS WHERE id = ?"
            this.db.all(sql , data, (err, rows) => {
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

    addTest(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TEST(name, procedureDescriptor, idSKU) VALUES (?,?,?)';
            this.db.run(sql, [data.name, data.procedureDescriptor, data.idSKU] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateTest(data){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TESTS SET name = ? AND procedureDescription =? AND idSKU =? WHERE id = ? '
            this.db.run(sql, [data.nname, data.ndescr,data.nsku, data.nid] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteTest(data){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTS WHERE id = ?'
            this.db.run(sql, [data] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }
}
module.exports = ItemDAO;