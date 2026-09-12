const serverless = require("serverless-http");
const app = require("../../server");
const connectDB = require("../../server/config/db");

const expressHandler = serverless(app);

module.exports.handler = async (event, context) => {
	try {
		await connectDB();
		return expressHandler(event, context);
	} catch (error) {
		console.error("[function] Database connection failed:", error.message);
		return {
			statusCode: 503,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: "Database unavailable" }),
		};
	}
};
