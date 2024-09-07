import { Router } from "express";
import * as usersController from "../controllers/usersController.mjs";

const usersRouter = Router();

usersRouter.get("/search", usersController.usersListSearchGet);

usersRouter.get("/:userId", usersController.userDetailsGet);

usersRouter.get("/update/:userId", usersController.updateUserPageGet);

usersRouter.get("/", usersController.usersListGet);


usersRouter.post("/new", usersController.newUserGet);

usersRouter.post("/update/:userId", usersController.updateUserPost);


usersRouter.post("/delete/:userId", usersController.deleteUserPost);



export default usersRouter;