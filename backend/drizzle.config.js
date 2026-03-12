import "dotenv/config";

export default {
  schema: "./models/*.js",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilters: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

