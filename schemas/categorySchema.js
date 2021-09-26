const mongoose = require("../config/mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
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
