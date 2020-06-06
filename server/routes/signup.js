const express = require('express')
const dbManager = require('../db')
const User = require('../models/user')

const router = express.Router()

router.post('/', (req, res) => {
	delete req.body.submit
	console.log(req.body)
	let {username, password} = req.body

	User.find({
		username
	})
	.then((user) => {
		if (user) {
			console.log('User exists')
			return Promise.resolve()
		} else {
			console.log('Creating user')
			return User.create(req.body)
		}
	})
	.then((result) => {
		if (result) {
			console.log('Created user')
			console.log(result.ops)
			req.flash('info', 'User created')
			res.redirect('/login')
		} else {
			req.flash('error', 'User already exists')
			res.redirect('/signup')
		}
		
	})
	.catch((err) => {
		console.log(err)
		res.render('error')
	})
})

router.get('/', (req, res) => {
	res.render('signup')
})

module.exports = router