import asyncHandler from "express-async-handler";
import { body, query, validationResult } from "express-validator";
import db from "../db/categoryQueries.mjs";
import NotFoundError from "./util/NotFoundError.mjs";

const createCategoryFormValidator = [
    body("category_name")
        .notEmpty().withMessage("category field must not be empty")
        .isAlpha('en-US', { ignore: ' ' }).withMessage("category field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("category field must contain a maximum of 30 characters")
]

const searchCategoryFormValidator = [
    query("category_name")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("category field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("category field must contain a maximum of 30 characters")
]

const categoryDetailsGet = asyncHandler(async (req, res) => {
    const categoryDetails = await db.getcategoryDetails(req.params.categoryId);

    if (!categoryDetails) {
        throw new NotFoundError(`category with id ${req.params.categoryId} not found`);
    }

    res.render("categoryDetails", {
        title: categoryDetails.category_name,
        category: {
            title: categoryDetails.category_name,
            category_name: categoryDetails.category_name
        }
    })
})

const categoriesListSearchGet = [
    searchcategoryFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const categoriesList = await db.getcategoriesList();
            res.status(400).render("categoriesList", { title: "categories", errors: errors.errors, categories: categoriesList })
            return;
        }

        const categoriesList = await db.getcategoriesSearchList({
            category_name: req.query.category_name
        })

        if(categoriesList.length === 0) {
            const categoriesList = await db.getcategoriesList();
            res.status(404).render("categoriesList");
        }
        res.render("categoriesList", { title: "categories", categories: categoriesList });
    })
]

export { categoryDetailsGet, categoriesListSearchGet }