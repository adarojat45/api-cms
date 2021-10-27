const mongoose = require("mongoose");

const { Schema } = mongoose;

const displayPictureSchema = new Schema({
	url: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
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
});

module.exports = displayPictureSchema;
