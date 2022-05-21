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

    newTableLoggedUsers(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS LOGGED_USERS(ID INTEGER, NAME VARCHAR, SURNAME VARCHAR, EMAIL VARCHAR, TYPE VARCHAR)';
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
            const sql = 'SELECT * FROM LOGGED_USERS'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const names = rows.map((r) => (
                    {
                        id: r.ID,
                        username: r.EMAIL,
                        name: r.NAME,
                        surname: r.SURNAME,
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

    getUserByEmailType(data){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE EMAIL = ? AND TYPE = ?'
            this.db.all(sql, [data.username, data.type] , (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const userinfo = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        surname: r.SURNAME,
                        email: r.EMAIL,
                        password: r.PASSWORD,
                        type: r.TYPE
                    }
                ));
                resolve(userinfo)
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

    deleteUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USERS WHERE EMAIL = ? AND TYPE = ?'
            this.db.run(sql, [data.username, data.type] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    dropUsers(){
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE USERS'
            this.db.run(sql, [] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    updateUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE USERS SET TYPE = ? WHERE EMAIL = ? AND TYPE = ?'
            this.db.run(sql, [data.newType, data.username, data.type] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    loginUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO LOGGED_USERS(ID, NAME, SURNAME, EMAIL, TYPE) VALUES (?,?,?,?,?)'
            this.db.run(sql, [data.id, data.name, data.surname, data.email, data.type] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    logoutUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM LOGGED_USERS WHERE '
            this.db.run(sql, [data.id, data.name, data.surname, data.email, data.type] , (err) => {
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