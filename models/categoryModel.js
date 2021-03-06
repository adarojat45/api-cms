const mongoose = require("../config/mongoose");
const CategorySchema = require("../schemas/categorySchema");

const Category = mongoose.model("Category", CategorySchema);

class CategoryModel {
	static create = async (payload = {}) => {
		try {
			return await Category.create(payload);
		} catch (error) {
			throw error;
		}
	};

	static findAll = async (condition = {}, filter = {}) => {
		try {
			return await Category.find({ ...condition, isDeleted: false }).sort({
				createdAt: "desc",
			});
		} catch (error) {
			throw error;
		}
	};

	static findOne = async (condition = {}) => {
		try {
			return await Category.findOne(condition).populate("_posts");
		} catch (error) {
			throw error;
		}
	};

	static update = async (condition = {}, payload = {}) => {
		try {
			return await Category.findOneAndUpdate(condition, payload, {
				returnOriginal: false,
			});
		} catch (error) {
			throw error;
		}
	};

	static updateMany = async (condition = {}, payload = {}) => {
		try {
			return await Category.updateMany(condition, payload, {
				returnOriginal: false,
			});
		} catch (error) {
			throw error;
		}
	};
}

module.exports = CategoryModel;
