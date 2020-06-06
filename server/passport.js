const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const {logger, log, error} = require('./customLogger')


passport.use(new LocalStrategy((username, password, done) => {

  	User.find({
  		username
  	})
	.then((myuser) => {
		log('Authenticating')

		if (!myuser) {
			log('User not found')
			return done(null, false, {message: 'User not found'})
		}

		if (password != myuser.password) {
			log('Password mismatch')
			return done(null, false, {message: 'Password mismatch'})
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
	console.log('serialize:' + user._id)
	done(null, user._id)
})

passport.deserializeUser(function(id, done) {
	User.findById(id)
	.then((myuser) => {
		done(null, myuser)
	})
	.catch((err) => {
		error(err)
		done(err, false)
	})
})

exports.passport = passport 