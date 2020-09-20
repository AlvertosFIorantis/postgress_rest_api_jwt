const { prependOnceListener } = require("./app");

const Pool = require("pg").Pool;

let pool = new Pool({
  host: "127.0.0.1",
  user: "user",
  password: "password123",
  port: 5432,
});

const main_pool = new Pool({
  host: "127.0.0.1",
  user: "user",
  password: "password123",
  port: 5432,
  database: "my_test",
});

const generateDatabase = async () => {
  try {
    my_test = await pool.query(
      "SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'my_test'"
    );

    console.log(my_test.rowCount);
    if (my_test.rowCount != 1) {
      await pool.query(`create database my_test`);
    }

    console.log("Database created ");
    pool.options.database = "my_test";
  } catch (err) {
    console.log("Error:", err);
    return err;
  }
};

module.exports = {
  generateDatabase: generateDatabase,
  pool: pool,
  main_pool: main_pool,
};
