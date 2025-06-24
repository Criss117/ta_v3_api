import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./integrations/trpc/router";
import { env } from "./lib/config";

const app = express();
const port = 8787;

const allowedOrigins: string[] = [
	"http://localhost:5173",
	"nimbly://",
	env.CLIENT_URL as string,
];

app.use(morgan("dev"));

app.use(
	cors({
		origin: allowedOrigins,
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use(
	"/api",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
	}),
);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
