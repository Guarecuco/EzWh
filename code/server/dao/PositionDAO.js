class PositionDAO{
    sqlite3 = require('sqlite3')
    constructor(dbname){
        this.db = new this.sqlite3.Database(dbname, (err) => {
            if(err) throw err
        })
    }
    printPositions(rows){
        const positions = rows.map((r) => (
            {
                positionID: r.POSITIONID,
                aisleID: r.AISLEID,
                row: r.ROW,
                col: r.COL,
                maxWeight: r.MAXWEIGHT,
                maxVolume: r.MAXVOLUME,
                occupiedWeight: r.OCCUPIEDWEIGHT,
                occupiedVolume: r.OCCUPIEDVOLUME
            }
        ));
        return positions;
    }

    newTablePosition(){
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS POSITION(POSITIONID VARCHAR PRIMARY KEY, AISLEID VARCHAR, ROW VARCHAR , COL VARCHAR, MAXWEIGHT INTEGER, MAXVOLUME INTEGER, OCCUPIEDWEIGHT INTEGER, OCCUPIEDVOLUME INTEGER)';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    storePosition(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITION(POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?,?,?,?,?,?,0,0)';
            this.db.run(sql, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume] , (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    getStoredPositions() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION'
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.printPositions(rows))
            })
        })
    }

    checkIfStored(positionID){
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) as COUNT FROM POSITION WHERE POSITIONID = ?"
            this.db.all(sql , positionID, (err, rows) => {
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

    updatePositionID(oldPosID,pos){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE POSITION SET POSITIONID=?, AISLEID=?, ROW=?, COL=?, MAXWEIGHT=?, MAXVOLUME=?, OCCUPIEDWEIGHT=?, OCCUPIEDVOLUME=? 
            WHERE POSITIONID = ?`
            this.db.run(sql , [ pos.newAisleID+pos.newRow+pos.newCol, pos.newAisleID, pos.newRow, pos.newCol,
                pos.newMaxWeight, pos.newMaxVolume, pos.newOccupiedWeight, pos.newOccupiedVolume, oldPosID ], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    changePositionID(oldPosID,newPosID){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE POSITION SET POSITIONID=?, AISLEID=?, ROW=?, COL=? WHERE POSITIONID = ?`
            this.db.run(sql , [ newPosID, newPosID.slice(0,4), newPosID.slice(4,8), newPosID.slice(8,12), oldPosID ], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }

    deletePosition(positionID){
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM POSITION WHERE POSITIONID = ?`
            this.db.run(sql, positionID, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            })
        })
    }
}

module.exports = PositionDAO;