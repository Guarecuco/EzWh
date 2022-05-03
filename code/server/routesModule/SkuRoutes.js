const express = require("express");

const router = express.Router()

router.get('/api/sku', (req,res)=>{
    let message = {
      message: 'Hello World!'
    }
    return res.status(200).json(message);
  }); 

module.exports = router