const app = require("./app");
const Pool = require("pg").Pool;
const { pool, generateDatabase, main_pool } = require("./db");

const my_database_function = async () => {
  try {
    await generateDatabase();
    pool.options.database = "my_test";
    console.log("database", pool.options.database);
    console.log("database", pool.options);
    await pool.query(`
      create extension if not exists "uuid-ossp";`);
    await main_pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    user_id uuid DEFAULT uuid_generate_v4()  UNIQUE,
    email VARCHAR(255) NOT NULL  UNIQUE,
    password  VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id)
  );`);

    console.log("tables created");
    app.listen(5000);

    console.log("app is running on port 5000");
  } catch (err) {
    console.log("err", err);
  }
};

my_database_function();

exports.main_pool = main_pool;

// docker run -d -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password123 --name db-my -p 5432:5432  --restart=always postgres
