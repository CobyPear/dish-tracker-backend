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

        if (response) {

            const id = cuid()
            return res.status(res.statusCode).json({
                menu: response.data.data,
                restaurant: restaurant_id,
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