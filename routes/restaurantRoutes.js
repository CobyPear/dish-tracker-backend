import express from 'express'
import { getRestaurantsByGeolocation, getRestaurantsByZip } from '../controllers/restaurantsController.js'

const router = express.Router()


router.get('/geo', getRestaurantsByGeolocation)
router.get('/zip', getRestaurantsByZip)

export default router