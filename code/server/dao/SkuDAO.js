const TestDescriptorDAO = require('../dao/TestDescriptorDAO.js');
const dbT = new TestDescriptorDAO('EzWh.db');

class SkuDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
        this.db.get("PRAGMA busy_timeout = 10000");
    }

    newTableSku(){
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR, WEIGHT INTEGER,
                VOLUME INTEGER, NOTES VARCHAR, PRICE FLOAT, AVAILABLEQUANTITY INTEGER, POSITION VARCHAR)`;
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    storeSku(data){
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY, POSITION) VALUES (?,?,?,?,?,?,"")`;
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.price, data.availableQuantity] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getStoredSkus() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                let pro = rows.map( async (r) => {
                    return {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        notes: r.NOTES,
                        position: r.POSITION,
                        availableQuantity: r.AVAILABLEQUANTITY,
                        price: r.PRICE,
                        testDescriptors: await dbT.getSKUDescriptors(r.ID)
                    }
                })
                resolve(rows===[]?rows:Promise.all(pro));
            })
        })
    }

    getSku(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE ID = ?'
            this.db.all(sql, id, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                let pro = rows.map( async (r) => {
                    return {
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        notes: r.NOTES,
                        position: r.POSITION,
                        availableQuantity: r.AVAILABLEQUANTITY,
                        price: r.PRICE,
                        testDescriptors: await dbT.getSKUDescriptors(r.ID)
                    }
                })
                resolve(Promise.all(pro));
            })
        })
    }

    countSku(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNTED FROM SKU WHERE ID = ?"
            this.db.get(sql , [id], (err, row) => {
                
                if(err){
                    reject(err);
                    return;
                }
                const count = row.COUNTED;
               
                resolve(count)
            })
        })
    }

    updateSku(id,sku){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKU SET DESCRIPTION=?, WEIGHT=?, VOLUME=?, NOTES=?, PRICE=?, AVAILABLEQUANTITY=? WHERE ID = ?`
            this.db.run(sql , [ sku.newDescription, sku.newWeight, sku.newVolume, sku.newNotes, sku.newPrice, sku.newAvailableQuantity, id ], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    setPosition(id,pos){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKU SET POSITION=? WHERE ID = ?`
            this.db.run(sql , [ pos, id ], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteSku(id){
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM SKU WHERE ID = ?`
            this.db.run(sql, id, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    setAvailableQuantityById(id, newQty) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE SKU
                         SET AVAILABLEQUANTITY = ?
                         WHERE ID == ?`
            this.db.run(sql, [newQty, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    //for testing only
    deleteAllSkus(){
        return new Promise((resolve, reject) => {
            const sql = `DROP TABLE IF EXISTS SKU`
            this.db.run(sql, [], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }
}

module.exports = SkuDAO;
