const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(`${err.name}, ${err.message}, ${err.stack}`);
  process.exit(1);
});

dotenv.config({ path: ".env" });
//DB connection
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully!");
  });

const app = require("./app");
const portNumber = process.env.PORT;
const server = app.listen(portNumber, () => {
  console.log(`Server is listening on port ${portNumber}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(`${err.name} ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
