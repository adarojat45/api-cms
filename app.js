const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
	res.status(200).json({
		message: "server is running",
	});
});

module.exports = app;
