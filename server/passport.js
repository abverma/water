const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const dbManager = require('./db')
const {logger, log, error} = require('./customLogger')


passport.use(new LocalStrategy((username, password, done) => {

  	const db = dbManager.getDb()
	db.collection('users').findOne({
		username: username
	})
	.then((myuser) => {
		log('Authenticating')

		if (username != myuser.username) {
			log('User not found')
			return done(null, false)
		}

		if (password != myuser.password) {
			log('Password mismatch')
			return done(null, false)
		}
		log('Password match')
		return done(null, myuser)
	})
	.catch((err) => {
		error(err)
		return done(err, false)
	})
	
}))

passport.serializeUser(function(user, done) {
	done(null, user._id)
})

passport.deserializeUser(function(id, done) {
	dbManager.findUserById(id)
	.then((myuser) => {
		done(null, myuser)
	})
	.catch((err) => {
		error(err)
		done(err, false)
	})
})

exports.passport = passport 