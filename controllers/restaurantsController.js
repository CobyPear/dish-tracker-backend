import axios from 'axios'
import cuid from 'cuid'

// @desc Get restaurants by geolocation
// @route GET /api/restaurants
// @access Public
const getRestaurantsByGeolocation = async(req, res) => {
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
                fullMenu: true
            },
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }

        const response = await axios.request(options)

        res.status(200).json({
            restaurants: response.data.data,
            page: page,
            pageId: cuid()
        })

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

// @desc Get restaurants by zipcode
// @route GET /api/restaurants
// @access Public
const getRestaurantsByZip = async(req, res) => {
    try {
        const { zip, page } = await req.body

        const options = {
            method: 'GET',
            url: `https://api.documenu.com/v2/restaurants/zip_code/${Number(zip)}`,
            params: {
                page: page,
                fullmenu: true
            },
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }

        const response = await axios.request(options)

        res.status(200).json({
            restaurants: response.data.data,
            page: page,
            pageId: cuid()
        })

    } catch (error) {
        console.log(error)
        res.status(error.code).json(error)
    }
}

export {
    getRestaurantsByGeolocation,
    getRestaurantsByZip

}