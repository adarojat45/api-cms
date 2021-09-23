const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
	name: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = categorySchema;
