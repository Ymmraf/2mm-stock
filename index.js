const express = require('express')
const app = express()
const hbs = require('hbs')

app.set('view engine', 'hbs');
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('server start')
})