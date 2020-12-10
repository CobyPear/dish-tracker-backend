import axios from 'axios'
import cuid from 'cuid'
// @desc Get menu by restaurantId
// @route GET /api/menu
// @access Public
export const getMenu = async(req, res, next) => {
    try {
        const { restaurant_id, page } = req.body

        const options = {
            method: 'GET',
            url: `https://api.documenu.com/v2/restaurant/${restaurant_id}/menuitems`,
            params: {
                page: page,
            },
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }

        const response = await axios.request(options)

        if (response)
            return res.status(200).json({
                menu: response.data.data,
                restaurant: restaurant_id,
                page: page,
                pageId: cuid()
            })
        else
            return res.status(503).json('Internal Server Error')


    } catch (error) {
        const statusCode = res.statusCode
        return res.status(statusCode).json({
            message: error.message,
            stack: error.stack,
            response: error.response
        })
    }
}