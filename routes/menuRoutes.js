const express = require('express')
const getMenu = require('../controllers/menuController.js')

const router = express.Router()


router.get('/', getMenu)

module.exports = router