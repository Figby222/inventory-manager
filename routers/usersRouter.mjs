import { Router } from "express";
import * as usersController from "../controllers/usersController.mjs";

const usersRouter = Router();

usersRouter.post("/new", usersController.newUserGet);

usersRouter.get("/search", usersController.usersListSearchGet);

usersRouter.get("/:userId", usersController.userDetailsGet);

usersRouter.get("/", usersController.usersListGet);



export default usersRouter;