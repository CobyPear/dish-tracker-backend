import axios from 'axios'
import cuid from 'cuid'

// @desc Get restaurants by geolocation
// @route GET /api/restaurants
// @access Public
const getRestaurantsByGeolocation = async(req, res, next) => {
    try {
        const { lat, lon, page } = await req.body

        const options = {
            method: 'GET',
            url: 'https://api.documenu.com/v2/restaurants/search/geo',
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

        const response = await axios.request(options)
        
        if (response) {
            const id = cuid()
            return res.status(res.statusCode).json({
                restaurants: response.data.data,
                page: page,
                pageId: id
            })
        } else {
            throw error
        }

    } catch (error) {
        const statusCode = res.statusCode
        return res.status(statusCode).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack,
            error: process.env.NODE_ENV === 'production' ? null : error
        })
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
            params: {
                page: page,
            },
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }

        const response = await axios.request(options)

        if (response) {
            const id = cuid()
            return res.status(res.statusCode).json({
                restaurants: response.data.data,
                page: page,
                pageId: id
            })
        } else {
            throw error
        }

    } catch (error) {
        const statusCode = res.statusCode
        return res.status(statusCode).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack,
            error: process.env.NODE_ENV === 'production' ? null : error
        })
    }
}

export {
    getRestaurantsByGeolocation,
    getRestaurantsByZip

}