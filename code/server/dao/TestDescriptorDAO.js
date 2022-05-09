class TestDescriptorDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableTests(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TESTS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, procedureDescriptor VARCHAR, idSKU INTEGER';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getTestsDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTS'           //Add condition to check if online
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const tests = rows.map((r) => (
                    {
                        id: r.id,
                        name: r.name,
                        procedureDescriptor: r.procedureDescriptor,
                        idSKU: r.idSKU
                    }
                    
                ));
                resolve(tests)
            })
        })
    }

    getTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTS WHERE id= ?'           //Add condition to check if online
            this.db.all(sql, [id], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const test = rows.map((r) => (
                    {
                        id: r.id,
                        name: r.name,
                        procedureDescriptor: r.procedureDescriptor,
                        idSKU: r.idSKU
                    }
                    
                ));
                resolve(test)
            })
        })
    }

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

    getSKUDescriptors(idSKU) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id FROM TESTS WHERE idSKU = ?'
            this.db.all(sql, [idSKU], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const results = rows.map((r) => (
                    {
                        id: r.id,
                    }
                ));
                resolve(results)
            })
        })
    }
}
module.exports = TestDescriptorDAO;