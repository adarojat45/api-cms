const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
	firstName: {
		type: String,
		required,
	},
	lastName: {
		type: String,
		required,
	},
	email: {
		type: String,
		required,
		unique,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = userSchema;
