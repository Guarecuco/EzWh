class UserDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    newTableName(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS NAMES(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR, SURNAME VARCHAR)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getStoredUsers() {
        return new Promise((resolve, reject) => {
            resolve([{id: 2,
                name: 'ale',
                surname: 'carachino'}])
            //const sql = 'SELECT * FROM USERS'
            //this.db.all(sql, [], (err, rows) => {
            //    if(err){
            //        reject(err);
            //        return;
             //   }
             //   const names = rows.map((r) => (
             //       {
             //           id: r.ID,
            //            name: r.NAME,
             //           surname: r.SURNAME
             //       }
                    
             //   ));
            //    resolve(names)
            //})
        })
    }

    storeUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO NAMES(NAME, SURNAME) VALUES (?,?)'
            this.db.run(sql, [data.name, data.surname] , (err) => {
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