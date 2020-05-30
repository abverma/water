const express = require('express')
require('dotenv').config()

const {logger, log, error} = require('./customLogger')
const dbManager = require('./db')

const PORT = process.env.PORT
const HOST = process.env.HOST
const app = express()
let db = null

//middlewares
app.use(logger)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))
//routes
app.use((req, res, next) => {
	if (db) {
		next()
	}
	else {
		log('Db connection not ready')
		throw Error('Db connection not ready')
	}
})

app.get('/', (req, res) => {
	res.sendFile('index.html')
})

app.get('/intake',(req, res) => {

	filter = req.query
	db.collection('intake').find(filter).limit(15).toArray()
		.then((result) => {
			res.status(200).json({
				success: true,
				data: result
			})
		})
		.catch((err) => {
			log(err)
			res.send(err)
		})
})

app.post('/intake',(req, res) => {

	let intake = req.body

	console.log(intake)

	db.collection('intake').updateOne({
		date: intake.date.split('T')[0]
	}, {
		$set: {
			intake: intake.intake
		}
	}, {
		upsert:true
	})
	.then((result) => {
		console.log('success')
		res.send({
			success: true
		})
	})
	.then((err) => {
		console.log(err)
		res.status(500)
	})
})

app.use(function (err, req, res, next) {
  error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, HOST, () => {
	console.clear()
	log(`[${new Date().toUTCString()}] Server started`)
	log(`Server listening at ${PORT}`)

	log('Connecting to db')

	dbManager.connect((err, result) => {
		if (err) {
			log('Could not connect to db')
			error(err)
		}
		else {
			db = result
		}
	})
	
})

