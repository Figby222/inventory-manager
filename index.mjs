import express from "express";
const app = express();
import path from "node:path";
import indexRouter from "./routers/indexRouter.mjs";
import housesRouter from "./routers/housesRouter.mjs";
import usersRouter from "./routers/usersRouter.mjs";
import amenitiesRouter from "./routers/amenitiesRouter.mjs";
import "dotenv/config";

const __dirname = import.meta.dirname;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use("/houses", housesRouter);

app.use("/users", usersRouter);

app.use("/amenities", amenitiesRouter);

app.use("/", indexRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})