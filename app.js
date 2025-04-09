const express = require("express");
const cookieParser = require("cookie-parser");
const config = require("config");
const sequelize = require("./config/db");
const mainRoute = require("./routes/index.routes")
const errorHandling = require("./middleware/error/error.handling")

const PORT = config.get("port") || 3001;

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api", mainRoute)

app.use(errorHandling)

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter:true})
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
