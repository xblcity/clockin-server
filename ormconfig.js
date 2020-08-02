const databaseConfig = require("./config").databaseConfig;

module.exports = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: databaseConfig.name,
  password: databaseConfig.password,
  database: "clockin",
  synchronize: true,
  entities: ["src/entity/*.ts"],
};
