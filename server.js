const express = require('express')
const app = express()
const dotenv = require('dotenv')
const timeout = require('connect-timeout')
const session = require('express-session')
const store = require('connect-redis')
const RedisStore = store(session);

dotenv.config()

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

const restaurantRoutes = require('./routes/restaurantRoutes.js') 
const menuRoutes = require('./routes/menuRoutes.js')

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))