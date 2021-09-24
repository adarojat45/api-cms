require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
	res.status(200).json({
		message: "server is running",
	});
});

app.use(router);

module.exports = app;
