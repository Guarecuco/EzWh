const TestDescriptorDAO = require('../dao/TestDescriptorDAO.js');
const dbT = new TestDescriptorDAO('EzWh');

class SkuDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    printSku(rows){
        const skus = rows.map((r) => (
            {
                id: r.ID,
                description: r.DESCRIPTION,
                weight: r.WEIGHT,
                volume: r.VOLUME,
                notes: r.NOTES,
                price: r.PRICE,
                position: r.POSITION,
                availableQuantity: r.AVAILABLEQUANTITY,
                //testDescriptors: dbT.getSKUDescriptors(r.ID)
            }
        ));
        return skus;
    }

    printSkuLess(rows){
        const skus = rows.map((r) => (
            {
                description: r.DESCRIPTION,
                weight: r.WEIGHT,
                volume: r.VOLUME,
                notes: r.NOTES,
                price: r.PRICE,
                position: r.POSITION,
                availableQuantity: r.AVAILABLEQUANTITY,
                //testDescriptors: dbT.getSKUDescriptors(r.ID)
            }
        ));
        return skus;
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
                resolve(this.printSku(rows))
            })
        })
    }

    checkIfStored(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNT FROM SKU WHERE ID = ?"
            this.db.all(sql , id, (err, rows) => {
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
/*
    checkIfStored(data){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNT FROM SKU WHERE DESCRIPTION = ?"
            this.db.all(sql , data.description, (err, rows) => {
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
*/

    getSku(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE ID = ?'
            this.db.all(sql, id, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.printSkuLess(rows))
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
}

module.exports = SkuDAO;
