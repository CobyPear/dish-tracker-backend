const axios = require('axios')
const cuid = require('cuid')
const Queue = require('bull')

// @desc Get restaurants by geolocation
// @route GET /api/restaurants
// @access Public
const getRestaurantsByGeolocation = async(req, res, next) => {
    try {
        const { lat, lon, page } = await req.body

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

        const id = cuid()

        let data = {
            restaurants: resp.data.data,
            page: page,
            pageId: id
        }

        let workQueue = new Queue('restaurant',process.env.REDIS_URL)
        let job = await workQueue.add(data)

        workQueue.on('global:completed', (jobId, result) => {
            console.log(`Job completed with result ${result}`);
          });
          
        return res.status(res.statusCode).json(job.data)

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
        const { zip, page } = await req.body

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
            pageId: id
        }

        let workQueue = new Queue('restaurant', process.env.REDIS_URL)
        let job = await workQueue.add(data)

        workQueue.on('global:completed', (jobId, result) => {
            console.log(`Job completed with result ${result}`);
          });

        return res.status(res.statusCode).json(job.data)

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