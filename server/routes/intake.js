const express = require('express')
const dbManager = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {

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

module.exports = router