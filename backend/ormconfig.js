require("dotenv/config");

const database = {
  development: "swapy",
  test: "swapy_test",
};

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "fabi",
  password: "dbaccess",
  database: database[process.env.NODE_ENV],
  entities: ["src/entity/*.ts"],
  synchronize: true,
  migrationsTableName: "migration",
  migrations: ["src/migration/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
  },
};
