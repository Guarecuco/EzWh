class TestDescriptorDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableTests(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TESTS(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR, PROCEDUREDESCRIPTION VARCHAR, IDSKU INTEGER)';
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
            const sql = 'SELECT * FROM TESTS'          
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const tests = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDUREDESCRIPTION,
                        idSKU: r.IDSKU
                    }
                    
                ));
                resolve(tests)
            })
        })
    }

    getTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTS WHERE ID = ?'           //Add condition to check if online
            this.db.get(sql, [data], (err, row) => {
                if(err){
                    reject(err);
                    return;
                }
                else{
                const test = 
                    {
                        id: row.ID,
                        name: row.NAME,
                        procedureDescription: row.PROCEDUREDESCRIPTION,
                        idSKU: row.IDSKU
                    };
                    
                resolve(test);
                }
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
           
            const sql = "SELECT COUNT(*) as COUNTED FROM TESTS WHERE ID = ?"
            this.db.get(sql , [data], (err, row) => {
                
                if(err){
                    reject(err);
                    return;
                }
                const count = row.COUNTED;
               
                resolve(count)
            })
        })
    }

    addTest(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TESTS(name, procedureDescription, idSKU) VALUES (?,?,?)';
            this.db.run(sql, [data.name, data.procedureDescription, data.idSKU] , (err) => {
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
            const sql = 'UPDATE TESTS SET NAME = ?, PROCEDUREDESCRIPTION =?, IDSKU =? WHERE ID = ? '
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
        this.newTableTests();
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id FROM TESTS WHERE idSKU = ?'
            this.db.all(sql, [idSKU], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const results = rows.map((r) => (r.ID));
                resolve(results)
            })
        })
    }

    deleteAllTests(){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTS'
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true)
            })
        })
    }

    dropTestsTable(){
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS TESTS '
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
module.exports = TestDescriptorDAO;