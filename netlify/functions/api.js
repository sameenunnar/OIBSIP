const serverless = require("serverless-http");
// IMPORTANT: require the file explicitly, not the "../../server" directory.
// server/package.json sets "main": "server.js", so requiring the directory
// silently loads server.js (which calls app.listen() and an un-awaited
// connectDB()) instead of the serverless-safe index.js that just exports `app`.
const app = require("../../server/index.js");
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
