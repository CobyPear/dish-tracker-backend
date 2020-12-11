import express from 'express'
const app = express()
import dotenv from 'dotenv'
import timeout from 'connect-timeout'

dotenv.config()

const PORT = process.env.PORT || 8080

app.use(timeout('10s'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

import restaurantRoutes from './routes/restaurantRoutes.js'
import menuRoutes from './routes/menuRoutes.js'

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))