const express = require("express");
const InternalOrderDAO = require('../dao/InternalOrderDAO.js')
const db = new InternalOrderDAO('EzWh')

const router = express.Router()
router.use(express.json());

module.exports = router;