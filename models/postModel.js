const mongoose = require("../config/mongoose");
const PostSchema = require("../schemas/postSchema");

const Post = mongoose.model("Post", PostSchema);

class PostModel {
	static create = async (paylaod = {}) => {
		try {
			return await Post.create(paylaod);
		} catch (error) {
			throw error;
		}
	};

	static findAll = async (condition = {}, filter = {}) => {
		try {
			return await Post.find({ ...condition, isDeleted: false }).populate(
				"_categories"
			);
		} catch (error) {
			throw error;
		}
	};

	static findOne = async (condition = {}) => {
		try {
			return await Post.findOne(condition).populate("_categories");
		} catch (error) {
			throw error;
		}
	};

	static update = async (condition = {}, payload = {}) => {
		try {
			return await Post.findOneAndUpdate(condition, payload, {
				returnOriginal: false,
			});
		} catch (error) {
			throw error;
		}
	};
}

module.exports = PostModel;
