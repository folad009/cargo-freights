require("dotenv").config();
const mysql = require("mysql2");

const asBool = (v, fallback = false) => {
  if (v == null || v === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(v).toLowerCase());
};

const buildDbConfig = () => {
  const connectionLimit = Math.min(
    Number(process.env.DB_CONNECTION_LIMIT) || 20,
    100,
  );

  // Railway/managed providers commonly expose one URL-style variable.
  // Also support accidental placement in DB_HOST for resilience.
  const hostMaybeUrl = process.env.DB_HOST || process.env.MYSQLHOST;
  const rawUrl =
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL ||
    (hostMaybeUrl && /^mysql:\/\//i.test(hostMaybeUrl) ? hostMaybeUrl : "");
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      const sslEnabled =
        asBool(process.env.DB_SSL, parsed.searchParams.get("ssl") === "true") ||
        /\.rlwy\.net$/i.test(parsed.hostname);
      const host = parsed.hostname;
      const port = Number(parsed.port) || 3306;
      const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));

      if (process.env.NODE_ENV === "production") {
        console.info(
          `[db] production target ${host}:${port}/${database} (source: URL env, ssl=${sslEnabled ? "on" : "off"})`,
        );
      }

      return {
        host,
        user: decodeURIComponent(parsed.username || ""),
        password: decodeURIComponent(parsed.password || ""),
        database,
        port,
        connectionLimit,
        waitForConnections: true,
        ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
      };
    } catch (_err) {
      // fall back to DB_* vars below
    }
  }

  const isProd = process.env.NODE_ENV === "production";
  const host = process.env.DB_HOST || process.env.MYSQLHOST || "";
  const user = process.env.DB_USER || process.env.MYSQLUSER || "";
  const password =
    process.env.DB_PASSWORD ??
    process.env.MYSQLPASSWORD ??
    "";
  const database =
    process.env.DB_NAME || process.env.MYSQLDATABASE || "";
  const port = Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306;

  if (isProd && !host) {
    throw new Error(
      "Missing DB config in production. Set MYSQL_URL (recommended) or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME in Vercel environment variables.",
    );
  }

  const normalizedHost = host || "localhost";
  const sslEnabled = asBool(process.env.DB_SSL, /\.rlwy\.net$/i.test(normalizedHost));

  if (isProd) {
    console.info(
      `[db] production target ${normalizedHost}:${port}/${database || "railway"} (source: DB_* env, ssl=${sslEnabled ? "on" : "off"})`,
    );
  }

  return {
    host: normalizedHost,
    user: user || "root",
    password,
    database: database || "railway",
    port,
    connectionLimit,
    waitForConnections: true,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
  };
};

const pool = mysql.createPool(buildDbConfig());

/**
 * Run SQL. Pass a second argument for bound parameters (recommended for user input).
 * @param {string} qry
 * @param {unknown[]=} params
 */
const mySqlQury = (qry, params) => {
  return new Promise((resolve, reject) => {
    const cb = (err, row) => {
      if (err) return reject(err);
      resolve(row);
    };
    if (params !== undefined) {
      pool.query(qry, params, cb);
    } else {
      pool.query(qry, cb);
    }
  });
};

module.exports = { conn: pool, mySqlQury };
