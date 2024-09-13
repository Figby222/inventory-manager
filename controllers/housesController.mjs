import asyncHandler from "express-async-handler";
import { query, body, validationResult } from "express-validator";
import db from "../db/houseQueries.mjs";
import NotFoundError from "./util/NotFoundError.mjs";

const createHouseFormValidator = [
    body("title")
        .notEmpty().withMessage("Title field must not be empty")
        .isLength({ max: 30 }).withMessage("Title field must be less than 30 characters"),
    body("price")
        .notEmpty().withMessage("Price field must not be empty")
        .isNumeric().withMessage("Price field must be a number")
        .isInt({ min: 10000 }).withMessage("Price field must be at least $10,000"),
    body("bedroom_count")
        .notEmpty().withMessage("Bedrooms field must not be empty")
        .isNumeric().withMessage("Bedrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bedrooms field must be above 0"),
    body("bathroom_count")
        .notEmpty().withMessage("Bathrooms field must not be empty")
        .isNumeric().withMessage("Bathrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bathrooms field must be above 0"),
    body("square_footage")
        .notEmpty().withMessage("Square Ft. field must not be empty")
        .isNumeric().withMessage("Square Ft. field must be a number")
        .isInt({ min: 0 }).withMessage("Square Ft. field must be above 0"),
    body("house_number")
        .notEmpty().withMessage("House Number field must not be empty")
        .isNumeric().withMessage("House Number field must be a number")
        .isInt({ min: 0 }).withMessage("House Number field must be above 0"),
    body("street_name")
        .notEmpty().withMessage("Street field must not be empty")
        .isAlpha().withMessage("Street field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Street field must contain a maximum of 30 characters"),
    body("city_name")
        .notEmpty().withMessage("City field must not be empty")
        .isAlpha().withMessage("City field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("City field must contain a maximum of 30 characters"),
    body("zip_code")
        .notEmpty().withMessage("Zip/Postal Code field must not be empty")
        .isNumeric().withMessage("Zip/Postal Code field must be a number")
        .isInt({ min: 0, max: 99999 }).withMessage("Zip/Postal Code field must be between 00000 and 99999"),
    body("country_name")
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
    query("bedroom_count")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Bedrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bedrooms field must be above 0"),
    query("bathroom_count")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Bathrooms field must be a number")
        .isFloat({ min: 0 }).withMessage("Bathrooms field must be above 0"),
    query("square_footage")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Square Ft. field must be a number")
        .isInt({ min: 0 }).withMessage("Square Ft. field must be above 0"),
    query("house_number")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("House Number field must be a number")
        .isInt({ min: 0 }).withMessage("House Number field must be above 0"),
    query("street_name")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Street field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Street field must contain a maximum of 30 characters"),
    query("city_name")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("City field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("City field must contain a maximum of 30 characters"),
    query("zip_code")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Zip/Postal Code field must be a number")
        .isInt({ min: 0, max: 99999 }).withMessage("Zip/Postal Code field must be between 00000 and 99999"),
    query("country_name")
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
    const houseDetails = await db.getHouseDetails(req.params.houseId)

    if (!houseDetails) {
        throw new NotFoundError(`House with id ${req.params.houseId} not found`);
    }

    console.log(houseDetails);

    res.render("houseDetails", {
        title: houseDetails.house.title,
        house: {
            title: houseDetails.house.title,
            images: houseDetails.house.images,
            address: houseDetails.house.address,
            amenities: houseDetails.house.amenities,
            bedroom_count: houseDetails.house.bedroom_count,
            bathroom_count: houseDetails.house.bathroom_count,
            furniture_status: houseDetails.furniture_status,
            price: houseDetails.house.price,
            square_footage: houseDetails.house.square_footage,
            furniture_status: houseDetails.house.furniture_status,
            sale_status: houseDetails.house.sale_status,
            owner_name: houseDetails.house.owner_name,
            listing_agent_name: houseDetails.house.listing_agent_name,
            images: houseDetails.images,
            amenities: houseDetails.amenities,
            categories: houseDetails.categories
        }
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
        
        const houseList = await db.getHousesSearchList({
            title: req.query.title,
            minimum_price: req.query.minimum_price,
            maximum_price: req.query.maximum_price,
            minimum_bedrooms: req.query.minimum_bedrooms,
            maximum_bedrooms: req.query.maximum_bedrooms,
            minimum_square_footage: req.query.minimum_square_footage,
            maximum_square_footage: req.query.maximum_square_footage,
            furniture_status: req.query.furniture_status,
            amentities: req.query.amenities,
            categories: req.query.categories
        })
    
        if (houseList.length === 0) {
            res.status(404).render("houseList");
        }
        res.render("houseList", { title: "Houses"});
    })
]

const createHousePageGet = asyncHandler(async (req, res) => {
    res.render("createHouse");
})

const createHousePost = [
    createHouseFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(400).render("createHouse", { errors: errors });
            return;
        }

        await db.insertHouse({
            title: req.body.title,
            price: req.body.price,
            bedroom_count: req.body.bedroom_count,
            bathroom_count: req.body.bathroom_count,
            square_footage: req.body.square_footage,
            house_number: req.body.house_number,
            city_name: req.body.city_name,
            state_name: req.body.state_name,
            zip_code: req.body.zip_code,
            country_name: req.body.country_name,
        })
        
        res.redirect("/houses");
    })
]

const housesListGet = asyncHandler(async (req, res) => {
    const housesList = await db.getHousesList();
    res.render("housesList", { title: "Houses", houses: housesList });
})




const updateHousePageGet = asyncHandler(async (req, res) => {
    const houseDetails = await db.getHouseDetails(req.params.houseId);

    if (!houseDetails) {
        throw new NotFoundError(`House with id ${req.params.houseId} not found`);
    }

    res.render("updateHouse", {
        title: houseDetails.title,
        price: houseDetails.price,
        bedroom_count: houseDetails.bedroom_count,
        bathroom_count: houseDetails.bathroom_count,
        square_footage: houseDetails.square_footage,
        house_number: houseDetails.house_number,
        street_name: houseDetails.street_name,
        city_name: houseDetails.city_name,
        state_name: houseDetails.state_name,
        zip_code: houseDetails.zip_code,
        country_name: houseDetails.country_name,
        amenities: houseDetails.amenities,
        categories: houseDetails.categories
    })
})

const updateHousePost = [
    createHouseFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render("updateHouse", { errors: errors });
            return;
        }

        const houseExists = await db.houseExists(req.params.houseId);
        if (!houseExists) {
            throw new NotFoundError(`House with id ${req.params.houseId} not found`);
        }

        await db.updateHouse(req.params.houseId, {
            title: req.body.title,
            price: req.body.price,
            bedroom_count: req.body.bedroom_count,
            bathroom_count: req.body.bathroom_count,
            square_footage: req.body.square_footage,
            house_number: req.body.house_number,
            street_name: req.body.street_name,
            city_name: req.body.city_name,
            state_name: req.body.state_name,
            zip_code: req.body.zip_code,
            country_name: req.body.country_name
        })
        
        res.redirect("/houses");
    })
]

const deleteHousePost = asyncHandler(async (req, res) => {
    if (!await db.houseExists(req.params.houseId)) {
        res.redirect("/houses");
    }

    await db.deleteHouse(req.params.houseId);
    res.redirect("/houses");
})

export { houseDetailsGet, housesListSearchGet, createHousePageGet, createHousePost, housesListGet, updateHousePageGet, updateHousePost, deleteHousePost }