import asyncHandler from "express-async-handler";
import { body, query, validationResult } from "express-validator";
import db from "../db/amenityQueries.mjs";
import NotFoundError from "./util/NotFoundError.mjs";

const createAmenityFormValidator = [
    body("amenity_name")
        .notEmpty().withMessage("Amenity field must not be empty")
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Amenity field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Amenity field must contain a maximum of 30 characters")
]

const searchAmenityFormValidator = [
    query("amenity_name")
        .optional({ values: "falsy" })
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Amenity field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Amenity field must contain a maximum of 30 characters")
]

const amenityDetailsGet = asyncHandler(async (req, res) => {
    const amenityDetails = await db.getAmenityDetails(req.params.amenityId);

    if (!amenityDetails) {
        throw new NotFoundError(`Amenity with id ${req.params.amenityId} not found`);
    }

    res.render("amenityDetails", {
        title: amenityDetails.amenity_name,
        amenity: {
            title: amenityDetails.amenity_name,
            amenity_name: amenityDetails.amenity_name
        }
    })
})

export { amenityDetailsGet }