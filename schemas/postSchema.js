const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	excerpt: {
		type: String,
	},
	description: {
		type: String,
	},
	tags: [String],
	_categories: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
	],
	isMarkdown: {
		type: Boolean,
		default: true,
	},
	views: {
		type: Number,
		default: 0,
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

module.exports = postSchema;
