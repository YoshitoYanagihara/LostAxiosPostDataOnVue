const express = require('express')
const app = express()

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/api/hoge", function (req, res) {
    console.log(req.body)
    res.json(req.body)
})

app.listen(3000, function () {
    console.log("=== RUN SERVER ===")
})
