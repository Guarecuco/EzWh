class SkuDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableSku(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR, WEIGHT INTEGER , VOLUME INTEGER, NOTES VARCHAR, PRICE FLOAT, AVAILABLEQUANTITY INTEGER)';
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
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?,?,?,?,?,?)';
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.price, data.availableQuantity] , (err) => {
                if(err){
                    console.log(err);
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
                const skus = rows.map((r) => (
                    {
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        notes: r.NOTES,
                        price: r.PRICE,
                        availableQuantity: r.AVAILABLEQUANTITY
                    }
                    
                ));
                resolve(skus)
            })
        })
    }

    checkIfStored(data){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNT FROM SKU WHERE DESCRIPTION = ?"
            this.db.all(sql , data.description, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                console.log(rows)
                const count = rows.map((r) => (
                    r.COUNT 
                ));
                resolve(count)
            })
        })
    }
}

module.exports = SkuDAO;