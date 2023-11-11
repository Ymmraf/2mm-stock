const express = require('express')
const app = express()
const hbs = require('hbs')
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://ymmraf:132542@2mm-stock.bauiper.mongodb.net/"
const PORT = process.env.PORT || 8000

app.set('view engine', 'hbs');
app.use('/static', express.static('static'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const client = new MongoClient(uri);
    async function run() {
        try {
            await client.connect();
            const db = client.db("2mm-stock");
            const coll = db.collection("stock");
            const cursor = coll.find({})
            const stockData = await cursor.toArray()

            const counter = db.collection('counter')
            const counterCursor = await counter.find({})
            const counterData = await counterCursor.toArray()
            let counterNumber = counterData[0].counter

            const historyColl = db.collection("update-history")
            const historyCursor = await historyColl.find({updateID : counterNumber})
            const historyData = await historyCursor.toArray()
            const latestName = historyData[0].name
            const latestTime = historyData[0].timeField
            const latestUpdate = latestName + " " + latestTime
            res.render('index', { stockData, latestUpdate })
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
})

app.get('/update', (req, res) => {
    res.render('update')
})

app.get('/history', (req, res) => {
    const client = new MongoClient(uri);
    async function run() {
        try {
            await client.connect();
            const db = client.db("2mm-stock");
            const coll = db.collection("stock");
            const cursor = coll.find({})
            const stockData = await cursor.toArray()
            res.render('index', { stockData, latestUpdate })
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
    res.render('history')
})

app.post('/update', (req, res) => {
    const name = req.body.name
    const size = req.body.size
    const action = req.body.action
    const quantity = req.body.quantity
    const client = new MongoClient(uri);
    let updateArr = []

    async function run() {
        try {
            await client.connect();
            const db = client.db("2mm-stock");
            const coll = db.collection("stock");

            if (typeof (size) === 'string') {
                if (action === 'cut') {
                    let cut = await coll.findOne({ size: size })
                    let cutStock = cut.cut
                    cutStock += Number(quantity)
                    updateArr.push({ updateOne: { "filter": { size: size }, "update": { $set: { cut: Number(cutStock) } } } })
                } else if (action === 'wash') {
                    let cut = await coll.findOne({ size: size })
                    let cutStock = cut.cut
                    cutStock -= Number(quantity)
                    updateArr.push({ updateOne: { "filter": { size: size }, "update": { $set: { cut: Number(cutStock) } } } })
                    let ready = await coll.findOne({ size: size })
                    let readyStock = ready.ready
                    readyStock += Number(quantity)
                    updateArr.push({ updateOne: { "filter": { size: size }, "update": { $set: { ready: Number(readyStock) } } } })
                } else if (action === 'sell') {
                    let ready = await coll.findOne({ size: size })
                    let readyStock = ready.ready
                    readyStock -= Number(quantity)
                    updateArr.push({ updateOne: { "filter": { size: size }, "update": { $set: { ready: Number(readyStock) } } } })
                } else if (action === 'editcut') {
                    updateArr.push({ updateOne: { "filter": { size: size }, "update": { $set: { cut: Number(quantity) } } } })
                } else if (action === 'editready') {
                    updateArr.push({ updateOne: { "filter": { size: size }, "update": { $set: { ready: Number(quantity) } } } })
                }
            } else {
                for (let i = 0; i < size.length; i++) {
                    if (action[i] === 'cut') {
                        let cut = await coll.findOne({ size: size[i] })
                        let cutStock = cut.cut
                        cutStock += Number(quantity[i])
                        updateArr.push({ updateOne: { "filter": { size: size[i] }, "update": { $set: { cut: Number(cutStock) } } } })
                    } else if (action[i] === 'wash') {
                        let cut = await coll.findOne({ size: size[i] })
                        let cutStock = cut.cut
                        cutStock -= Number(quantity[i])
                        updateArr.push({ updateOne: { "filter": { size: size[i] }, "update": { $set: { cut: Number(cutStock) } } } })
                        let ready = await coll.findOne({ size: size[i] })
                        let readyStock = ready.ready
                        readyStock += Number(quantity[i])
                        updateArr.push({ updateOne: { "filter": { size: size[i] }, "update": { $set: { ready: Number(readyStock) } } } })
                    } else if (action[i] === 'sell') {
                        let ready = await coll.findOne({ size: size[i] })
                        let readyStock = ready.ready
                        readyStock -= Number(quantity[i])
                        updateArr.push({ updateOne: { "filter": { size: size[i] }, "update": { $set: { ready: Number(readyStock) } } } })
                    } else if (action[i] === 'editcut') {
                        updateArr.push({ updateOne: { "filter": { size: size[i] }, "update": { $set: { cut: Number(quantity[i]) } } } })
                    } else if (action[i] === 'editready') {
                        updateArr.push({ updateOne: { "filter": { size: size[i] }, "update": { $set: { ready: Number(quantity[i]) } } } })
                    }
                }
            }

            await coll.bulkWrite(updateArr)

            const historyColl = db.collection('update-history')
            const today = new Date()

            const counter = db.collection('counter')
            const counterCursor = await counter.find({})
            const counterData = await counterCursor.toArray()
            let counterNumber = counterData[0].counter
            counterNumber++
            await counter.updateOne({}, {$set:{counter : counterNumber}})

            await historyColl.insertOne({ updateID : counterNumber, timeField : today, name: name, size: size, action: action, quantity: quantity })
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
    res.redirect('success')
})

app.get('/success', (req, res) => {
    res.render('success')
})

app.listen(PORT, () => {
    console.log('server start')
})