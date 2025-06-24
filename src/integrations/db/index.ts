import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/lib/config";
import type { TX } from "@/modules/shared/models/types";

export function generateDBClient({
  url,
  authToken,
}: {
  url: string;
  authToken?: string;
}) {
  return drizzle({
    connection: {
      url,
      authToken,
    },
  });
}

export class DBClient {
  private db: ReturnType<typeof generateDBClient>;

  constructor() {
    const db = generateDBClient({
      url: env.TURSO_URL,
      authToken: env.TURSO_ACCESS_TOKEN,
    });

    if (!db) {
      throw new Error();
    }

    this.db = db;
  }

  public get client() {
    return this.db;
  }

  public async transaction<T>(callback: (tx: TX) => Promise<T>): Promise<T> {
    return this.db.transaction((tx) => callback(tx));
  }
}

export const dbClient = new DBClient();
