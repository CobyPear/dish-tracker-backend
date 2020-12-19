let throng = require('throng')
let Queue = require('bull')

let REDIS_URL = process.env.REDIS_URL

let workers = process.env.WEB_CONCURRENCY || 1

let maxJobsPerWorker = 2

function start () {
    // connect to the queue
    let workQueue = new Queue('restaurant', REDIS_URL)

    workQueue.process(maxJobsPerWorker, async (job) => {
        console.log(job)
        return { data: job.data }
    })
}

throng({ workers, start })