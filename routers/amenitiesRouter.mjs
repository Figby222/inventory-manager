import { Router } from "express";
import * as amenitiesController from "../controllers/amenitiesController.mjs";

const amenitiesRouter = Router();

amenitiesRouter.get("/search", amenitiesController.amenitiesListSearchGet);

amenitiesRouter.get("/update/:amenityId", amenitiesController.updateAmenityPageGet);

amenitiesRouter.get("/:amenityId", amenitiesController.amenityDetailsGet)

amenitiesRouter.get("/new", amenitiesController.createAmenityPageGet);

amenitiesRouter.get("/", amenitiesController.amenitiesListGet);


amenitiesRouter.post("/update/:amenityId", amenitiesController.updateAmenityPost);

amenitiesRouter.post("/delete/:amenityId", amenitiesController.deleteAmenityPost);


amenitiesRouter.post("/new", amenitiesController.createAmenityPost);

export default amenitiesRouter;