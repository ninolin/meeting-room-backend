const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
