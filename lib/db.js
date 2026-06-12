import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "fortune500",
  ssl: {
    rejectUnauthorized: true,
  },
});