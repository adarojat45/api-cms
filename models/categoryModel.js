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
			return await Category.find({ ...condition, isDeleted: false });
		} catch (error) {
			throw error;
		}
	};

	static findOne = async (condition = {}) => {
		try {
			return await Category.findOne(condition);
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
}

module.exports = CategoryModel;
