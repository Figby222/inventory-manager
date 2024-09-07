import { Router } from "express";
import * as housesController from "../controllers/housesController.mjs";

const housesRouter = Router();


housesRouter.get("/:houseId", housesController.houseDetailsGet);

housesRouter.get("/search", housesController.housesListSearchGet);

housesRouter.get("/update/:houseId", housesController.updateHousePageGet);

housesRouter.get("/", housesController.housesListGet);



housesRouter.post("/update/:houseId", housesController.updateHousePost);

housesRouter.post("/delete/:houseId", housesController.deleteHousePost);


housesRouter.post("/new", housesController.newHousePost);

export default housesRouter;