const mongoose = require("../config/mongoose");
const UserSchema = require("../schemas/userSchema");

const User = mongoose.model("User", UserSchema);

class UserModel {
	static create = async (payload = {}) => {
		try {
			return await User.create(payload);
		} catch (error) {
			throw error;
		}
	};

	static findAll = async (condition = {}, filter = {}) => {
		try {
			return await User.find({ ...condition, isDeleted: false });
		} catch (error) {
			next(error);
		}
	};

	static findOne = async (condition = {}) => {
		try {
			return await User.findOne(condition);
		} catch (error) {
			throw error;
		}
	};

	static update = async (condition = {}, payload = {}) => {
		try {
			return await User.findByIdAndUpdate(condition, payload, {
				returnOriginal: false,
			});
		} catch (error) {
			throw error;
		}
	};
}

module.exports = UserModel;
