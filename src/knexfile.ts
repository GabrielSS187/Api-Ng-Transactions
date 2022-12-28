import path from "path";
import { env } from "process";

const configKnexDatabase = {
  development: {
    client: "pg",
    connection: env.DATABASE_URL,
    charset  : "utf8",
    timezone: "UTC",
    searchPath: ["knex", "public"],
      migrations: {
         tableName: "knex_migrations",
         directory: path.resolve(`src/data/migrations`),
         extension: "ts",
      },
      pool: {
        afterCreate: function(connection: any, callback: any) {
          connection.query('SET time_zone = timezone;', function(err: any) {
            callback(err, connection);
          });
        },
         min: 2,
         max: 10,
      },
  },
};

export default configKnexDatabase;