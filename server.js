import express from 'express'
const app = express()
import dotenv from 'dotenv'
import timeout from 'connect-timeout'
import session from 'express-session'
import RedisStore from 'connect-redis'

dotenv.config()

// redis URL
let redis_url = process.env.REDIS_URL

if (process.env.NODE_ENV === 'development') {
    redis_url = 'redis://127.0.0.1'
}

app.use(session({
    store: process.env.NODE_ENV === 'production' ? new RedisStore({
            url: process.env.REDIS_URL
        }) :
        null,
    secret: 'smokeymuffinsandteapotarethecutest1',
    resave: true,
    saveUninitialized: true
}))

const PORT = process.env.PORT || 8080

app.use(timeout('10s'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

import restaurantRoutes from './routes/restaurantRoutes.js'
import menuRoutes from './routes/menuRoutes.js'

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))