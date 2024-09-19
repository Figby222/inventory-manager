import asyncHandler from "express-async-handler";
import { body, query, validationResult } from "express-validator";
import db from "../db/categoryQueries.mjs";
import NotFoundError from "./util/NotFoundError.mjs";

const createCategoryFormValidator = [
    body("category_name")
        .notEmpty().withMessage("Category field must not be empty")
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Category field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Category field must contain a maximum of 30 characters")
]

const searchCategoryFormValidator = [
    query("category_name")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("category field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("category field must contain a maximum of 30 characters")
]

const categoryDetailsGet = asyncHandler(async (req, res) => {
    const categoryDetails = await db.getCategoryDetails(req.params.categoryId);

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
    searchCategoryFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const categoriesList = await db.getCategoriesList();
            res.status(400).render("categoriesList", { title: "categories", errors: errors.errors, categories: categoriesList })
            return;
        }

        const categoriesList = await db.getCategoriesSearchList({
            category_name: req.query.category_name
        })

        if(categoriesList.length === 0) {
            const categoriesList = await db.getCategoriesList();
            res.status(404).render("categoriesList");
        }
        res.render("categoriesList", { title: "categories", categories: categoriesList });
    })
]

const createCategoryPageGet = asyncHandler(async (req, res) => {
    res.render("createCategory", { title: "Create a category", category: {} });
})

const createCategoryPost = [
    createCategoryFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(400).render("createCategory", {
                title: "Create a Category",
                errors: errors.errors,
                category: {
                    ...req.body
                }
            });
            return;
        }

        await db.createCategory({
            category_name: req.body.category_name
        });

        res.redirect("/categories");
    })
]

const categoriesListGet = asyncHandler(async (req, res) => {
    const categoriesList = await db.getCategoriesList();
    res.render("categoriesList", { title: "Categories", categories: categoriesList });
})

const updateCategoryPageGet = asyncHandler(async (req, res) => {
    const categoryDetails = await db.getCategoryDetails(req.params.categoryId);

    if(!categoryDetails) {
        throw new NotFoundError(`Category with id ${req.params.categoryId} not found`);
    }

    res.render("updateCategory", {
        title: categoryDetails.category_name,
        category: {
            title: categoryDetails.category_name,
            id: categoryDetails.id
        }
    });
})

const updateCategoryPost = [
    createCategoryFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const categoryDetails = await db.getCategoryDetails(req.params.categoryId);
            res.status(400).render("updateCategory", {
                title: "Update Category",
                erorrs: errors.errors,
                user: {
                    ...userDetails
                }
            });
            return;
        }

        if (!db.categoryExists(req.params.categoryId)) {
            throw new NotFoundError(`Category with id ${req.params.categoryId} not found`);
        }

        await db.updateCategory(req.params.categoryId, {
            category_name: req.body.category_name
        })

        res.redirect("/categories");
    })
]

const deleteCategoryPost = asyncHandler(async (req, res) => {
    if (!await db.categoryExists(req.params.categoryId)) {
        res.redirect("/categories");
    }

    await db.deleteCategory(req.params.categoryId);
    res.redirect("/categories");
})

export { categoryDetailsGet, categoriesListSearchGet, createCategoryPageGet, createCategoryPost, categoriesListGet, updateCategoryPageGet, updateCategoryPost, deleteCategoryPost }