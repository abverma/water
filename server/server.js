require('dotenv').config()
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const {logger, log, error} = require('./customLogger')
const dbManager = require('./db')
const {passport} = require('./passport')
const PORT = process.env.PORT
const HOST = process.env.HOST
const publicDir = path.join(__dirname, './public')
const app = express()
const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.redirect('/login')
	}
}

//middlewares
app.use(logger)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({ 
	secret: 'keyboard', 
	resave: true,
  	saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
	if (dbManager.getDb()) {
		next()
	}
	else {
		log('Db connection not ready')
		throw Error('Db connection not ready')
	}
})


//routes

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/login')
})

app.get('/login', (req, res) => {
	res.sendFile(path.join(publicDir, 'login.html'))
})

app.post('/login', 
  passport.authenticate('local', { 
  	successRedirect: '/',
  	failureRedirect: '/login' 
  })
)

app.get('/', isLoggedIn, (req, res) => {
    console.log(req.user)
    console.log(req.session)
    console.log(req.isAuthenticated())
	res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/intake', isLoggedIn, (req, res) => {
	let filter = req.query
	let userId = req.user._id
	dbManager.findIntake(filter, userId)
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

app.post('/intake', isLoggedIn, (req, res) => {

	let intake = req.body
	let userId = req.user._id

	console.log(intake)

	dbManager.updateIntake(intake, userId)
	.then((result) => {
		res.send({
			success: true
		})
	})
	.then((err) => {
		console.log(err)
		res.status(500)
	})
})

app.use(express.static(publicDir))

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

