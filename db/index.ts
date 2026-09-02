import { drizzle, type NetlifyDbDatabase } from "drizzle-orm/netlify-db";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

type DatabaseInstance =
  | (NetlifyDbDatabase<typeof schema> & { $client: unknown })
  | (NodePgDatabase<typeof schema> & { $client: unknown });

let _db: DatabaseInstance | null = null;

export function getDb(): DatabaseInstance {
  if (!_db) {
    _db = drizzle({ schema });
  }
  return _db;
}

export const db: DatabaseInstance = new Proxy({} as DatabaseInstance, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<PropertyKey, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export * from "./schema";
