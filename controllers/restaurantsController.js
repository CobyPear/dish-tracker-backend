const axios = require('axios')
const Queue = require('bull')
const url = require('url')
const querystring = require('querystring')

// @desc Get restaurants by geolocation
// @route GET /api/restaurants
// @access Public
const getRestaurantsByGeolocation = async (req, res, next) => {
    try {
        let rawUrl = req.originalUrl
        let parsedUrl = url.parse(rawUrl)
        let parsedQs = querystring.parse(parsedUrl.query)

        const { lat, lon, page } = parsedQs

        const options = {
            method: 'GET',
            url: 'https://api.documenu.com/v2/restaurants/search/geo',
            timeout: 15000,
            params: {
                lat: Number(lat),
                lon: Number(lon),
                page: Number(page),
                distance: 1,
            },
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }

        const resp = await axios.request(options)

        let data = {
            restaurants: resp.data.data,
            page: page,
            pageId: `${lat}_${lon}_${page}`
        }

        let workQueue = new Queue('restaurant',process.env.REDIS_URL)
        let job = await workQueue.add(data)

        return (
            res.status(res.statusCode).json(job.data),
            workQueue.close()
            )
    } catch (error) {
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } else if (error.request) {
            console.log(error.request.data)
        } else {
            console.log('Error', error.message)
        }
        console.log(error.config)
    }
}

// @desc Get restaurants by zipcode
// @route GET /api/restaurants
// @access Public
const getRestaurantsByZip = async(req, res, next) => {
    try {
        let rawUrl = req.originalUrl
        let parsedUrl = url.parse(rawUrl)
        let parsedQs = querystring.parse(parsedUrl.query)

        const { zip, page } = parsedQs

        const options = {
            method: 'GET',
            url: `https://api.documenu.com/v2/restaurants/zip_code/${zip}`,
            timeout: 15000,
            params: {
                page: page,
            },
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }

        const resp = await axios.request(options)

        const id = cuid()

        const data = {
            restaurants: resp.data.data,
            page: page,
            pageId: `${zip}_${page}`
        }

        let workQueue = new Queue('restaurant', process.env.REDIS_URL)
        let job = await workQueue.add(data)

        return (
            res.status(res.statusCode).json(job.data),
            workQueue.close()
            )

    } catch (error) {
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } else if (error.request) {
            console.log(error.request.data)
        } else {
            console.log('Error', error.message)
        }
        console.log(error.config)
    }
}

module.exports = {
    getRestaurantsByGeolocation,
    getRestaurantsByZip

}