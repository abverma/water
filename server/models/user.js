const {ObjectID} = require('mongodb')
const dbManager = require('../db')

exports.findById = (id) => {
  	const db = dbManager.getDb()

	return db.collection('users').findOne({
		_id: ObjectID(id)
	})
}

exports.find = (query) => {
  	const db = dbManager.getDb()

	return db.collection('users').findOne(query)
}

exports.create = (user) => {
	const db = dbManager.getDb()

	return db.collection('users').insertOne(user, {
		forceServerObjectId: false
	})
}