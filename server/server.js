//npms
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const exphbs  = require('express-handlebars')
const MongoDBStore = require('connect-mongodb-session')(session)
const bodyParser = require('body-parser')
const path = require('path')

//app modules
const {logger, log, error} = require('./customLogger')
const dbManager = require('./db')
const {passport} = require('./passport')
const intake = require('./routes/intake')
const login = require('./routes/login')
const signup = require('./routes/signup')


//variables and constants
const app = express()
const publicDir = path.join(__dirname, './public')
const store = new MongoDBStore({
  uri: dbManager.getUri(),
  collection: 'sessions'
})
const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.redirect('/login')
	}
}

app.engine('handlebars', exphbs())
app.set('views', publicDir)
app.set('view engine', 'handlebars')

//middlewares
app.use(logger)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({ 
	secret: process.env.SECRET, 
	store: store,
	cookie: {
		maxAge:  1000 * 60 * 60 * 24 * 2
	},
	resave: false,
  	saveUninitialized: true
}))
app.use(flash())
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
app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/login')
})
app.get('/', isLoggedIn, (req, res) => {
	res.sendFile(path.join(publicDir, 'index.html'))
})
app.use('/signup', signup)
app.use('/login', login)
app.use('/intake', isLoggedIn, intake)
app.use(express.static(publicDir))
app.use(function (err, req, res, next) {
	error(err.stack)
	res.render('error')
})


app.listen(process.env.PORT, process.env.HOST, () => {
	log(`[${new Date().toUTCString()}] Server started`)
	log(`Server listening at ${process.env.PORT}`)

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
