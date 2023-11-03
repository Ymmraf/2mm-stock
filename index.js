const express = require('express')
const app = express()
const hbs = require('hbs')

app.set('view engine', 'hbs');
app.use('/static', express.static('static'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/update', (req, res) => {
    res.render('update')
})

app.post('/update', (req, res) => {
    res.redirect('success')
})

app.get('/success', (req, res) => {
    res.render('success')
    
})

app.listen(3000, () => {
    console.log('server start')
})