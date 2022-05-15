class SkuitemDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }

    printSkuitems(rows){
        const skuitem = rows.map((r) => (
            {
                RFID: r.RFID,
                SKUId: r.SKUID,
                Available: r.AVAILABLE,
                DateOfStock: r.DATEOFSTOCK,
            }
        ));
        return skuitem;
    }

    printSkuitemsLess(rows){
        const skuitem = rows.map((r) => (
            {
                RFID: r.RFID,
                SKUId: r.SKUID,
                DateOfStock: r.DATEOFSTOCK,
            }
        ));
        return skuitem;
    }
    
    getStoredSkuitems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.printSkuitems(rows))
            })
        })
    }

    newTableSkuitem(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKUITEM(RFID VARCHAR PRIMARY KEY, SKUID INTEGER, AVAILABLE INTEGER, DATEOFSTOCK VARCHAR)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    storeSkuitem(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUITEM(RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES (?,?,?,?)';
            this.db.run(sql, [data.RFID, data.SKUId, 0, data.DateOfStock] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getStoredSkuitem(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?'
            this.db.all(sql, rfid, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.printSkuitems(rows))
            })
        })
    }

    getAvailableSkuitems(SKUId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE SKUID = ? AND AVAILABLE = 1'
            this.db.all(sql, SKUId, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.printSkuitemsLess(rows))
            })
        })
    }

    updateSkuitem(rfid,item){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKUITEM SET RFID=?, AVAILABLE=?, DATEOFSTOCK=? WHERE RFID = ?`
            this.db.run(sql , [ item.newRFID, item.newAvailable, item.newDateOfStock, rfid ], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteSkuitem(rfid){
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM SKUITEM WHERE RFID = ?`
            this.db.run(sql, rfid, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    setAvailabilityByRFID(rfid, newQty){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKUITEM SET AVAILABLE = ? WHERE RFID == ?`
            this.db.run(sql, [newQty, rfid], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }
}

module.exports = SkuitemDAO;
