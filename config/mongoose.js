const mongoose = require("mongoose");

main().catch((err) => {
	console.log("🚀 ~ file: mongo.js ~ line 4 ~ main ~ err", err);
});

async function main() {
	const DB_NAME = process.env.DB_NAME || "ajatdarojat45_dev";
	const DB_URL =
		`${process.env.DB_URL}/${DB_NAME}` || `mongodb://localhost:27017/${DB_NAME}`;

	await mongoose.connect(DB_URL);
}

module.exports = mongoose;
