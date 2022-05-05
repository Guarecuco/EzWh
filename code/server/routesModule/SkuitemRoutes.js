const express = require("express");
const SkuitemDAO = require('../dao/SkuitemDAO.js')
const db = new SkuitemDAO('EzWh')

const router = express.Router()
router.use(express.json());

module.exports = router