(() => {
    const fs = require("fs")
    const config = {}
    config.PORT = process.env.PORT || 8080
    config.ROOT = `${__dirname}/../../client`
    config.LOG_FILE = `${__dirname}/../logs/node.js.log`
    config.COUNTRIES = `${__dirname}/../../data/countries.json`
    config.API_URL = 'http://universities.hipolabs.com/search?country='
    config.logFile = (request, logs) => {
        log = {}
        log.date = new Date()
        log.url = request.url
        log.method = request.method
        logs.push(log)
        fs.appendFile(config.LOG_FILE, JSON.stringify(logs), (error) => {
            if (error)
                console.log(`\t|Error appending to a file\n\t|${error}`)
            // else
            //     console.info('\t|File was appended successfully!')
        })
    }
    module.exports = config
})()
