import asyncHandler from "express-async-handler";
import { query, body, validationResult } from "expres-validator";
import db from "../db/queries.mjs";
import NotFoundError from "./util/NotFoundError.mjs";

const createHouseFormValidator = [
    body("title")
        .notEmpty().withMessage("Title field must not be empty")
        .isLength({ max: 30 }).withMessage("Title field must be less than 30 characters"),
    body("price")
        .notEmpty().withMessage("Price field must not be empty")
        .isNumeric().withMessage("Price field must be a number")
        .isInt({ min: 10000 }).withMessage("Price field must be at least $10,000"),
    body("bedroomCount")
        .notEmpty().withMessage("Bedrooms field must not be empty")
        .isNumeric().withMessage("Bedrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bedrooms field must be above 0"),
    body("bathroomCount")
        .notEmpty().withMessage("Bathrooms field must not be empty")
        .isNumeric().withMessage("Bathrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bathrooms field must be above 0"),
    body("squareFootage")
        .notEmpty().withMessage("Square Ft. field must not be empty")
        .isNumeric().withMessage("Square Ft. field must be a number")
        .isInt({ min: 0 }).withMessage("Square Ft. field must be above 0"),
    body("houseNumber")
        .notEmpty().withMessage("House Number field must not be empty")
        .isNumeric().withMessage("House Number field must be a number")
        .isInt({ min: 0 }).withMessage("House Number field must be above 0"),
    body("streetName")
        .notEmpty().withMessage("Street field must not be empty")
        .isAlpha().withMessage("Street field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Street field must contain a maximum of 30 characters"),
    body("cityName")
        .notEmpty().withMessage("City field must not be empty")
        .isAlpha().withMessage("City field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("City field must contain a maximum of 30 characters"),
    body("zipCode")
        .notEmpty().withMessage("Zip/Postal Code field must not be empty")
        .isNumeric().withMessage("Zip/Postal Code field must be a number")
        .isInt({ min: 0, max: 99999 }).withMessage("Zip/Postal Code field must be between 00000 and 99999"),
    body("countryName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Country field must only contain alphabetical characters")
        .isLength().withMessage("Country field must contain a maximum of 30 characters"),
    body("amenities[*]")
        .optional({ values: "falsy" }),
    body("categories[*]")
        .optional({ values: "falsy" }),
    body("amenities")
        .toArray()
        .optional({ values: "falsy" }),
    body("categories")
        .toArray()
        .optional({ values: "falsy" }),
        
]

const searchHouseFormValidator = [
    query("title")
        .optional({ values: "falsy" })
        .isLength({ max: 30 }).withMessage("Title field must be less than 30 characters"),
    query("price")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Price field must be a number")
        .isInt({ min: 10000 }).withMessage("Price field must be at least $10,000"),
    query("bedroomCount")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Bedrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bedrooms field must be above 0"),
    query("bathroomCount")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Bathrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bathrooms field must be above 0"),
    query("squareFootage")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Square Ft. field must be a number")
        .isInt({ min: 0 }).withMessage("Square Ft. field must be above 0"),
    query("houseNumber")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("House Number field must be a number")
        .isInt({ min: 0 }).withMessage("House Number field must be above 0"),
    query("streetName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Street field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Street field must contain a maximum of 30 characters"),
    query("cityName")
        /optional({ values: "falsy" })
        .isAlpha().withMessage("City field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("City field must contain a maximum of 30 characters"),
    query("zipCode")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Zip/Postal Code field must be a number")
        .isInt({ min: 0, max: 99999 }).withMessage("Zip/Postal Code field must be between 00000 and 99999"),
    query("countryName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Country field must only contain alphabetical characters")
        .isLength().withMessage("Country field must contain a maximum of 30 characters"),
    query("amenities[*]")
        .optional({ values: "falsy" }),
    query("categories[*]")
        .optional({ values: "falsy" }),
    query("amenities")
        .toArray()
        .optional({ values: "falsy" }),
    query("categories")
        .toArray()
        .optional({ values: "falsy" }),
        
]

const houseDetailsGet = asyncHandler(async (req, res) => {
    const houseDetails = db.getHouseDetails(req.params.houseId)

    if (!houseDetails) {
        throw new NotFoundError(`House with id ${req.params.houseId} not found`);
    }

    res.render("houseDetails", {
        title: houseDetails.title,
        images: houseDetails.images,
        address: houseDetails.address,
        amenities: houseDetails.amenities,
        bedroomCount: houseDetails.bedroomCount,
        bathroomCount: houseDetails.bathroomCount,
        furnitureStatus: houseDetails.furnitureStatus,
        price: houseDetails.price,
        ownerName: houseDetails.ownerName,
        listingAgentName: houseDetails.listingAgentName
    })
})

const housesListSearchGet = [
    searchHouseFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render("houseList", { errors: errors });
            return;
        }
        
        const houseList = db.getHousesSearchList({
            title: req.query.title,
            minimumPrice: req.query.minimumPrice,
            maximumPrice: req.query.maximumPrice,
            minimumBedrooms: req.query.minimumBedrooms,
            maximumBedrooms: req.query.maximumBedrooms,
            minimumSquareFootage: req.query.minimumSquareFootage,
            maximumSquareFootage: req.query.maximumSquareFootage,
            furnitureStatus: req.query.furnitureStatus,
            amentities: req.query.amenities,
            categories: req.query.categories
        })
    
        if (houseList.length === 0) {
            res.status(404).render("houseList");
        }
        res.render("houseList");
    })
]

const createHousePageGet = asyncHandler(async (req, res) => {
    console.log("Create house form view");
    res.send("Create house form view");
})

const createHousePost = [
    createHouseFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log("Render createHouseGet with errors");
            res.status(400).send("Create hoouse form view with errors");
            return;
        }

        console.log(`Add insert house into db with ${req.body}`);
        res.redirect("/houses");
    })
]

const housesListGet = asyncHandler(async (req, res) => {
    const houseList = [ { houseList: "blah blah blah" } ]
    console.log("house list query");

    if (houseList.length === 0) {
        res.status(404).send("error page");
    }

    res.send("houseList view");
})




const updateHousePageGet = asyncHandler(async (req, res) => {
    const houseDetails = { houseDetails: "blah blah blah" };
    console.log("house details search query");

    if (!houseDetails) {
        res.status(404).send("error page");
    }

    res.send("house update view");
})

const updateHousePost = [
    createHouseFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            console.log("Render updateHousePageGet with errors");
            res.status(400).send("Update house form view with errors");
            return;
        }

        console.log(`Update house query with ${req.body} & ${req.params.houseId}`);
        res.send("houseList view");
    })
]

const deleteHousePost = asyncHandler(async (req, res) => {
    console.log(`Delete hosue query with ${req.params.houseId}`);
    res.redirect("/houses");
})

export { houseDetailsGet, housesListSearchGet, createHousePageGet, createHousePost, housesListGet, updateHousePageGet, updateHousePost, deleteHousePost }