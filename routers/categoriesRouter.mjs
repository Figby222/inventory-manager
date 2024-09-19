import { Router } from "express";
import * as categoriesController from "../controllers/categoriesController.mjs";

const categoriesRouter = Router();

categoriesRouter.get("/search", categoriesController.categoriesListSearchGet);

categoriesRouter.get("/update/:categoryId", categoriesController.updateCategoryPageGet);

categoriesRouter.get("/:categoryId", categoriesController.categoryDetailsGet);

categoriesRouter.get("/new", categoriesController.createCategoryPageGet);

categoriesRouter.get("/", categoriesController.categoriesListGet);


categoriesRouter.post("/update/:categoryId", categoriesController.updateCategoryPost);

categoriesRouter.post("/delete/:categoryId",  categoriesController.deleteCategoryPost);


categoriesRouter.post("/new", categoriesController.createCategoryPost);

export default categoriesRouter;