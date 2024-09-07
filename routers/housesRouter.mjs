import { Router } from "express";
import * as housesController from "../controllers/housesController.mjs";

const housesRouter = Router();


housesRouter.get("/:houseId", housesController.houseDetailsGet);

housesRouter.get("/search", housesController.housesListSearchGet);


housesRouter.post("/new", housesController.newHousePost);

housesRouter.get("/", housesController.housesListGet);

export default housesRouter;