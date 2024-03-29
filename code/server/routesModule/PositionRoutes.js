const express = require("express");
const PositionDAO = require('../dao/PositionDAO.js')
const db = new PositionDAO('EzWh.db')

const router = express.Router()
router.use(express.json());

router.get('/api/positions', async (req,res)=>{
  try{
    const positions = await db.getStoredPositions();
    return res.status(200).json(positions);
  }
  catch(err){
    res.status(500).end();
  }
});

router.post('/api/position', async (req,res)=>{
  try{
    //Check if body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    let pos = req.body;
      //Check if any field is empty
    if (!( pos && pos.positionID && pos.aisleID && pos.row && pos.col && pos.maxWeight && pos.maxVolume )) {
      return res.status(422).json({error: `Invalid position data`});
    }
      //Check positionID format
    if ( pos.positionID != pos.aisleID + pos.row + pos.col ) {
      return res.status(422).json({error: `Invalid positionID`});
    }
    await db.newTablePosition();
    //Check if position exist
    let get = await db.getPosition(pos.positionID);
    if (get.length <= 0){
      await db.storePosition(pos);
      return res.status(201).end(); 
    }   
    return res.status(503).json({error: `Position already exists`});
  }
  catch(err){
      res.status(503).end();
  }
});

router.put('/api/position/:positionID', async (req,res)=>{
    try{
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const oldPosID=req.params.positionID;
        const pos=req.body;
        if (!( oldPosID && pos && pos.newAisleID && pos.newRow && pos.newCol && pos.newMaxWeight && pos.newMaxVolume &&
            pos.newOccupiedWeight !== undefined && pos.newOccupiedVolume !== undefined && pos.newOccupiedWeight<=pos.newMaxWeight && pos.newOccupiedVolume<=pos.newMaxVolume)) {
                return res.status(422).json({error: `Invalid position data`});
        }

        let get = await db.getPosition(oldPosID);
        if (get.length<=0){
            return res.status(404).json({error: `no position associated to positionID`});
        }
        await db.updatePositionID(oldPosID,pos);
        return res.status(200).end(); 
    }
    catch(err){
      res.status(503).end();
    }
});

router.put('/api/position/:positionID/changeID', async (req,res)=>{
    try{
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: `Empty body request`});
        }
        const oldPosID=req.params.positionID;
        const newPosID=req.body.newPositionID;
        if (!( oldPosID && newPosID )) {
            return res.status(422).json({error: `Invalid position data`});
        }
        let get = await db.getPosition(oldPosID);
        if (get.length<=0){
            return res.status(404).json({error: `no position associated to positionID`});
        }
        get = await db.getPosition(newPosID);
        if (get.length>0){
            return res.status(422).json({error: `newPositionID already exists`});
        }
        await db.changePositionID(oldPosID,newPosID);
        return res.status(200).end(); 
    }
    catch(err){
      res.status(503).end();
    }
});

//there is a mistake in the description, should be 'delete a Position receiving its positionID'
router.delete('/api/position/:positionID', async (req,res)=>{
    try{
        const positionID=req.params.positionID
        if (!positionID) {
            return res.status(422).json({error: `Invalid position data`});
        }
        let get = await db.getPosition(positionID);
        if (get.length<=0){
            return res.status(422).json({error: `no position associated to positionID`});
        }
        await db.deletePosition(positionID);
        return res.status(204).end(); 
    }
    catch(err){
      res.status(503).end();
    }
});

//for testing only
router.delete('/api/position/', async (req,res)=>{
  try{
    await db.deleteAllPositions();
    await db.newTablePosition();
    return res.status(204).end();
  }
  catch(err){
    res.status(503).send(err);
  }
});

function positionStartup () {
  try{
      //Droping table
      db.deleteAllPositions();
      //Creating table
      db.newTablePosition();
  }
  catch(err){
      console.log(err);
  }

}
positionStartup();


module.exports = router