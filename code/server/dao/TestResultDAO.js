class TestResultDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newResultTests(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESULTS(ID INTEGER PRIMARY KEY AUTOINCREMENT, RFID VARCHAR, IDTESTDESCRIPTOR INTEGER, DATA DATE, RESULT BOOLEAN)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getSKUResults(data) {
        return new Promise((resolve, reject) => {
            console.log(data);
            const sql = 'SELECT * FROM RESULTS WHERE  RFID = ?'           //Add condition to check if online
            this.db.all(sql, [data], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const results = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.IDTESTDESCRIPTOR,
                        Date: r.DATA,
                        Result: (r.RESULT === 0 ? false : true)
                    }
                    
                ));
                resolve(results)
            })
        })
    }

    getSKUResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESULTS WHERE RFID = ? AND ID = ?'           //Add condition to check if online
            this.db.all(sql, [data.rfid, data.id], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const results = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.IDTESTDESCRIPTOR,
                        Date: r.DATA,
                        Result: (r.RESULT === 0 ? false : true)
                    }
                    
                ));
                resolve(results)
            })
        })
    }

    addResult(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESULTS(RFID, IDTESTDESCRIPTOR, DATA, RESULT) VALUES (?,?,?,?)';
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
            const sql = 'UPDATE RESULTS SET IDTESTDESCRIPTOR = ?,  DATA =?,  RESULT =? WHERE ID = ? AND RFID = ? '
            this.db.run(sql, [data.etest, data.edate,data.eresult, data.id, data.rfid] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deleteResult(data){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESULTS WHERE ID = ? AND RFID = ?'
            this.db.run(sql, [data.id, data.rfid] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    countFailedTest(rfid){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as COUNT FROM RESULTS WHERE RFID == ? AND RESULT == TRUE'
            this.db.all(sql, rfid , (err, rows) => {
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

    deleteAllResults(){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESULTS'
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true)
            })
        })
    }

    dropResultsTable(){
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE RESULTS'
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
module.exports = TestResultDAO;
