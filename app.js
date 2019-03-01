// NPM dependencies
const path = require('path') // config abs paths
const lodash = require('lodash')
const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json()
// constants 
const PORT = 3000

//set view directory - finds view dir
app.set('views', path.join(__dirname, 'views'))
//set view engine 
app.set('view engine', 'ejs')
// tell express how to find and serve the static public directory
app.use(express.static(path.join(__dirname, 'public')))
//handle POST requests set up
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const pageData = { pageData: { title: 'Baby Pay' } }

app.get('/', (req, res) => res.render('index', pageData))
app.get('/create-account', (req, res) => res.render('create-account', pageData))
app.post('/create-account', jsonParser, (req, res) => {
    const type = lodash.get(req, 'body.type')
    const payment_provider = lodash.get(req, 'body.payment_provider')
    const service_name = lodash.get(req, 'body.service_name')
    const description = optionalField(req, 'body.description')
    const analytics_id = optionalField(req, 'body.analytics_id')
    const requires_3ds = optionalField(req, 'body.requires_3ds')

    request.post('http://localhost:9300/v1/api/accounts', {
        body: {
            type: type,
            PAYMENT_PROVIDER_FIELD: payment_provider,
            service_name: service_name,
            description: description,
            analytics_id: analytics_id,
            requires_3ds: requires_3ds
        },
        json: true
    })
    res.render('create-account', { pageData: { service_name: service_name, welcome:`'s Gateway account created`} })
})

//runs server on port 3000
app.listen(3000, () => console.log(`Louise running on port: ${PORT} http://localhost:${PORT}!`))

// utils
const logi = (msg) => {
    console.log(JSON.stringify(msg))
}
const optionalField = (req, fieldname) => {
    const fieldValue = lodash.get(req, fieldname);
    return fieldValue ? fieldValue : null
}

module.exports = { request }