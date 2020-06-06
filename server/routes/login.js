const express = require('express')
const {passport} = require('../passport')
const path = require('path')

const router = express.Router()

const publicDir = path.join(__dirname, '../public')

router.get('/', (req, res) => {
	// res.sendFile(path.join(publicDir, 'login.html'))
	res.render('login')
})

router.post('/', 
  passport.authenticate('local', { 
  	successRedirect: '/',
  	failureRedirect: '/login',
  	failureFlash: true
  })
)

module.exports = router