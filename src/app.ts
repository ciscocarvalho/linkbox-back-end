import express from "express";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import session from "./middlewares/session";
import { FRONTEND_URL } from "./constants";
import responseHelpers from "./middlewares/responseHelpers";

const swaggerDocument = YAML.load("./openapi.yml");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(session);
app.use(responseHelpers);

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument));

app.use("/", routes);

app.get("/", (req, res) => {
  res.status(200).send('<h1 style="text-align: center">Online!</h1>');
});

export default app;
