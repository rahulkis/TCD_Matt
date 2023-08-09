const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("../config/connection");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const errorHandler = require("./middleware/error");
const xss = require("xss-clean");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')
const swaggerAutogen = require('swagger-autogen')()
const ENV_INCLUDE = [ 'PORT', 'ENV', 'JWT_SECRET'];

//load env variables
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();

//Passport Config
require("../config/passport")(passport);

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates");

app.enable("trust proxy");

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.set("view options", { layout: false });

app.use(xss());

//Set Public Folder
app.use(express.static(publicDirPath));

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 })
);

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// enable cors
app.use(cors());
app.options("*", cors());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

const swaggerFile = require('../swagger_output.json')
const endpointsFiles = ['./src/routes/api']
swaggerAutogen('./swagger_output.json', endpointsFiles)

//Router
app.use("/api", require("./routes/api"));
app.use("/admin", require("./routes/admin"));
app.use("/status", (req, res, next) => {
    const env = ENV_INCLUDE.reduce( ( obj, current ) => { obj[ current ] = process.env[ current ]; return obj; }, {} );

    res.status( 200 ).send( {
      uptime: process.uptime(),
      environment: env,
      memory: process.memoryUsage()
    } );
});

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.ENV} mode on port ${process.env.PORT}`
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
