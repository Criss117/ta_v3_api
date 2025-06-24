"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: "./drizzle",
    schema: [
        "./src/integrations/db/tables.ts",
        "./src/integrations/db/auth-schema.ts",
        "./src/integrations/db/relations.ts",
    ],
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_URL,
        authToken: process.env.TURSO_ACCESS_TOKEN,
    },
});
