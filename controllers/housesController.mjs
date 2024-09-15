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
    body("street")
        .notEmpty().withMessage("Street field must not be empty")
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Street field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Street field must contain a maximum of 30 characters"),
    body("city")
        .notEmpty().withMessage("City field must not be empty")
        .isAlpha('en-US', { ignore: ' ' }).withMessage("City field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("City field must contain a maximum of 30 characters"),
    body("zip_code")
        .notEmpty().withMessage("Zip/Postal Code field must not be empty")
        .isNumeric().withMessage("Zip/Postal Code field must be a number")
        .isInt({ min: 0, max: 99999 }).withMessage("Zip/Postal Code field must be between 00000 and 99999"),
    body("country")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Country field must only contain alphabetical characters")
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
    query("street")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Street field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Street field must contain a maximum of 30 characters"),
    query("city")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("City field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("City field must contain a maximum of 30 characters"),
    query("zip_code")
        .optional({ values: "falsy" })
        .isNumeric().withMessage("Zip/Postal Code field must be a number")
        .isInt({ min: 0, max: 99999 }).withMessage("Zip/Postal Code field must be between 00000 and 99999"),
    query("country")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Country field must only contain alphabetical characters")
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
            owner: houseDetails.house.owner,
            listing_agent: houseDetails.house.listing_agent,
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
            res.status(400).render("housesList", { title: "Houses", errors: errors });
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
            res.status(404).render("housesList", { title: "Houses not found"});
        }
        res.render("housesList", { title: "Houses"});
    })
]

const createHousePageGet = asyncHandler(async (req, res) => {
    const amenities = await db.getAmenities();
    const categories = await db.getCategories();
    console.log(amenities);

    res.render("createHouse", { 
        title: "Create a house", 
        house: { amenities: [], categories: [] }, 
        amenities: amenities, 
        categories: categories 
    });
})

const createHousePost = [
    createHouseFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const houseAmenities = await db.getAmenitiesSearch(req.body.amenity_ids);
            const houseCategories = await db.getCategoriesSearch(req.body.category_ids);
            const amenities = await db.getAmenities();
            const categories = await db.getCategories();
            res.status(400).render("createHouse", { 
                title: "Create House", 
                errors: errors.errors, 
                house: { 
                    ...req.body, 
                    amenities: houseAmenities, 
                    categories: houseCategories 
                }, 
                amenities: amenities,
                categories: categories 
            });
            return;
        }

        await db.createHouse({
            title: req.body.title,
            price: req.body.price,
            bedroom_count: req.body.bedroom_count,
            bathroom_count: req.body.bathroom_count,
            square_footage: req.body.square_footage,
            house_number: req.body.house_number,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            country: req.body.country,
            amenity_ids: req.body.amenity_ids,
            category_ids: req.body.category_ids,
            owner_id: 1
        })
        
        res.redirect("/houses");
    })
]

const housesListGet = asyncHandler(async (req, res) => {
    const housesList = await db.getHousesList();
    const amenities = await db.getAmenities();
    const categories = await db.getCategories();

    res.render("housesList", { 
        title: "Houses", 
        houses: housesList, 
        amenities: amenities, 
        categories: categories 
    });
})




const updateHousePageGet = asyncHandler(async (req, res) => {
    const houseDetails = await db.getHouseDetails(req.params.houseId);
    const amenities = await db.getAmenities();
    const categories = await db.getCategories();

    if (!houseDetails) {
        throw new NotFoundError(`House with id ${req.params.houseId} not found`);
    }

    res.render("updateHouse", {
        title: houseDetails.house.title,
        house: {
            title: houseDetails.house.title,
            id: houseDetails.house.id,
            price: houseDetails.house.price,
            bedroom_count: houseDetails.house.bedroom_count,
            bathroom_count: houseDetails.house.bathroom_count,
            square_footage: houseDetails.house.square_footage,
            house_number: houseDetails.house.house_number,
            street: houseDetails.house.street,
            city: houseDetails.house.city,
            state: houseDetails.house.state,
            zip_code: houseDetails.house.zip_code,
            country: houseDetails.house.country,
            amenities: houseDetails.amenities,
            categories: houseDetails.categories
        },
        amenities: amenities,
        categories: categories
    })
})

const updateHousePost = [
    createHouseFormValidator,
    asyncHandler(async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const houseDetails = await db.getHouseDetails(req.params.houseId);
            const amenities = await db.getAmenities();
            const categories = await db.getCategories();

            res.status(400).render("updateHouse", { 
                title: "Update House", 
                errors: errors.errors,
                house: {
                    ...houseDetails.house,
                    amenities: houseDetails.amenities,
                    categories: houseDetails.categories,
                },
                amenities: amenities,
                categories: categories,
            });
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
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            country: req.body.country,
            amenity_ids: req.body.amenity_ids,
            category_ids: req.body.category_ids
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