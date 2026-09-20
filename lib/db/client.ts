import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH ?? "./data/asm.db";

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

/**
 * A single connection, reused across requests. better-sqlite3 is
 * synchronous, so there is no pool to manage.
 */
const globalForDb = globalThis as unknown as { asmDb?: Database.Database };

export const db = globalForDb.asmDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") globalForDb.asmDb = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    slug TEXT PRIMARY KEY,
    ref TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    programme_fr TEXT NOT NULL,
    programme_en TEXT NOT NULL,
    location_fr TEXT NOT NULL,
    location_en TEXT NOT NULL,
    year TEXT NOT NULL,
    frame_fr TEXT NOT NULL,
    frame_en TEXT NOT NULL,
    role_fr TEXT NOT NULL,
    role_en TEXT NOT NULL,
    summary_fr TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    body_fr TEXT NOT NULL DEFAULT '[]',
    body_en TEXT NOT NULL DEFAULT '[]',
    cover TEXT,
    gallery TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    full_name TEXT NOT NULL,
    founder TEXT NOT NULL,
    city TEXT NOT NULL,
    street_fr TEXT NOT NULL DEFAULT '',
    street_en TEXT NOT NULL DEFAULT '',
    postal_city_fr TEXT NOT NULL,
    postal_city_en TEXT NOT NULL,
    phone_display TEXT NOT NULL,
    phone_href TEXT NOT NULL,
    whatsapp_display TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT NOT NULL,
    coordinates TEXT NOT NULL,
    map_query TEXT NOT NULL,
    instagram TEXT NOT NULL DEFAULT '',
    linkedin TEXT NOT NULL DEFAULT '',
    ordre_number TEXT NOT NULL DEFAULT '',
    bio_fr TEXT NOT NULL DEFAULT '[]',
    bio_en TEXT NOT NULL DEFAULT '[]',
    portrait TEXT
  );
`);
