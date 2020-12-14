const axios = require('axios')
const cuid = require('cuid')

// @desc Get menu by restaurantId
// @route GET /api/menu
// @access Public
const getMenu = async(req, res, next) => {
    try {
        const { restaurant_id, page } = req.body

        const options = {
            method: 'GET',
            url: `https://api.documenu.com/v2/restaurant/${restaurant_id}/menuitems`,
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

        return res.status(res.statusCode).json({
            menu: resp.data.data,
            restaurant: restaurant_id,
            page: page,
            pageId: id
        })


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

module.exports = getMenu