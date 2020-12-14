const express = require('express')
const { getRestaurantsByGeolocation, getRestaurantsByZip}  = require('../controllers/restaurantsController.js')

const router = express.Router()


router.get('/geo', getRestaurantsByGeolocation)
router.get('/zip', getRestaurantsByZip)

module.exports = router