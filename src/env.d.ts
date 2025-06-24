declare namespace NodeJS {
	interface ProcessEnv {
		BETTER_AUTH_SECRET: string;
		TURSO_URL: string;
		TURSO_ACCESS_TOKEN?: string;
		GITHUB_CLIENT_ID: string;
		GITHUB_SECRET: string;
		CLIENT_DOMAIN: string;
		CLIENT_URL: string;
	}
}
