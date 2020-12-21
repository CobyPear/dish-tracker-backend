const axios = require('axios')
const Queue = require('bull')
const url = require('url')
const querystring = require('querystring')

// @desc Get menu by restaurantId
// @route GET /api/menu
// @access Public
const getMenu = async(req, res, next) => {
    try {
        let rawUrl = req.originalUrl
        let parsedUrl = url.parse(rawUrl)
        let parsedQs = querystring.parse(parsedUrl.query)

        const { restaurant_id, page } = parsedQs

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

        const data = {
            menu: resp.data.data,
            restaurant: restaurant_id,
            page: page,
            totalPages: resp.data.total_pages,
            pageId: `${restaurant_id}_${page}`
        }

        let workQueue = new Queue('menu', process.env.REDIS_URL)
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

module.exports = getMenu