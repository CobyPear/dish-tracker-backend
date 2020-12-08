import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

import restaurantRoutes from './routes/restaurantRoutes.js'

app.use('/api/restaurants', restaurantRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))