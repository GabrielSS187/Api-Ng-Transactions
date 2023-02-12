import { env } from "process";

const configKnexDatabase = {
  development: {
    client: "pg",
    connection: env.DATABASE_URL,
    searchPath: ["knex", "public"],
      migrations: {
         tableName: "knex_migrations",
         extension: "ts",
      },
      pool: {
         min: 2,
         max: 10,
      },
  },
};

export default configKnexDatabase;