class TestResultDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newResultTests(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESULTS(id INTEGER PRIMARY KEY AUTOINCREMENT, INTEGER idSKU, idTestDescriptor INTEGER, Date DATE, Result BOOL';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getSKUResults(idSKU) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESULTS WHERE idSKU = ?'           //Add condition to check if online
            this.db.all(sql, [idSKU], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const results = rows.map((r) => (
                    {
                        rid: r.id,
                        rdescr: r.idTestDescriptor,
                        rdate: r.Date,
                        rresult: r.Result
                    }
                    
                ));
                resolve(results)
            })
        })
    }

    getSKUResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESULTS WHERE idSKU = ? AND id = ?'           //Add condition to check if online
            this.db.all(sql, [data.rfid, data.id], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const results = rows.map((r) => (
                    {
                        rid: r.id,
                        rdescr: r.idTestDescriptor,
                        rdate: r.Date,
                        rresult: r.Result
                    }
                    
                ));
                resolve(results)
            })
        })
    }

    addTest(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESULTS(idSKU, idTestDescriptor, Date, Result) VALUES (?,?,?,?)';
            this.db.run(sql, [data.rfid, data.idTestDescriptor, data.Date, data.Result] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateResult(data){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESULT SET idTestDescriptor = ? AND Date =? AND Result =? WHERE id = ? AND idSKU = ? '
            this.db.run(sql, [data.etest, data.edate,data.eresult, data.eid, data.esku] , (err) => {
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
            const sql = 'DELETE FROM RESULTS WHERE id = ? AND idSKU = ?'
            this.db.run(sql, [data.eid, data.esku] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }
}
module.exports = TestResultDAO;