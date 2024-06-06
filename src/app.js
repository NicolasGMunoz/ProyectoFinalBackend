import mongoose from "mongoose";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { __dirname } from "./util.js";
import { __mainDirname } from "./utils.js"
import configs from "./config.js";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import SessionsRouter from "./routes/sessions.routes.js";
import ProductsRouter from "./routes/products.routes.js";
import CartsRouter from "./routes/carts.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import UsersRouter from "./routes/users.router.js"
import errorHandler from './middlewares/errors/index.js';
import { addLogger } from "./utils/logger.js";




const app = express();
const PORT = configs.port;

const swaggerOptions = {
	definition: {
	  openapi: '3.0.1',
	  info: {
		title: 'Documentación del proyecto API de ecommerce',
		description: 'API pensada en resolver el proceso de compras y ventas de productos en una plataforma ecommerce'
	  }
	},
	apis: [`${__mainDirname}/docs/**/*.yaml`]
  }

const specs = swaggerJsdoc(swaggerOptions)
app.use('/api/docs/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))



app.engine(".handlebarss", handlebars.engine({ extname: ".handlebars" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".hbs");
app.use(addLogger)

app.disable('X-Powered-By')
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
	session({
		store: MongoStore.create({
			client: mongoose.connection.getClient(),
			ttl: 3600
		}),
		secret: "Coder55660secret",
		resave: true,
		saveUninitialized: true
	})
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/sessions", SessionsRouter);
app.get("/api/loggerTest", (req, res) => {
	req.logger.fatal("Prueba para logger fatal");
	req.logger.error("Prueba para logger error");
	req.logger.warning("Prueba para logger warning");
	req.logger.info("Prueba para logger info");
	req.logger.http("Prueba para logger http");
	req.logger.debug("Prueba para logger debug");
  res.send({ status: "success", message: "Logger tested successfully"})
});
app.use("/", ViewsRouter);
app.use(errorHandler)

app.use((req, res) => {
	res.status(404).send({ status: "error", message: "404 not found" })
});

const server = app.listen(PORT, () => {
	console.log(`Server is ready on http://localhost:${PORT}`);
});

try {
	await mongoose.connect(configs.mongoUrl)
	console.log("Database connected")
} catch (error) {
	console.log(error.message)
	mongoose.disconnect()
}
