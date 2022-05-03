class UserDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableUsers(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS USERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR, SURNAME VARCHAR, EMAIL VARCHAR, PASSWORD VARCHAR, TYPE VARCHAR)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getLoggedUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS'           //Add condition to check if online
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.TYPE
                    }
                    
                ));
                resolve(names)
            })
        })
    }

    getStoredSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE TYPE = "supplier"'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.TYPE
                    }
                    
                ));
                resolve(names)
            })
        })
    }

    getStoredUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.TYPE
                    }
                    
                ));
                resolve(names)
            })
        })
    }

    getStoredUsersWithoutManagers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE TYPE != "manager"'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        type: r.TYPE
                    }
                    
                ));
                resolve(names)
            })
        })
    }

    checkIfStored(data){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(EMAIL) as COUNT FROM USERS WHERE EMAIL = ? AND TYPE = ?'
            this.db.all(sql, [data.username, data.type] , (err, rows) => {
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

    storeUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USERS(NAME, SURNAME, EMAIL, PASSWORD, TYPE) VALUES (?,?,?,?,?)'
            this.db.run(sql, [data.name, data.surname, data.username, data.password, data.type] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

}

module.exports = UserDAO;