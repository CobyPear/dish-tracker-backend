import express from 'express'
const app = express()
import dotenv from 'dotenv'
import path from 'path'
const __dirname = path.resolve()

dotenv.config()

const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname)))

import restaurantRoutes from './routes/restaurantRoutes.js'
import menuRoutes from './routes/menuRoutes.js'

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))