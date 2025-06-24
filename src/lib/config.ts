import "dotenv/config";

export const env = {
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	TURSO_URL: process.env.TURSO_URL,
	TURSO_ACCESS_TOKEN: process.env.TURSO_ACCESS_TOKEN,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_SECRET: process.env.GITHUB_SECRET,
	CLIENT_DOMAIN: process.env.CLIENT_DOMAIN,
	CLIENT_URL: process.env.CLIENT_URL,
};
