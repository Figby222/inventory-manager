import asyncHandler from "express-async-handler";
import { body, query, validationResult } from "express-validator";
import db from "../db/queries.mjs";
import NotFoundError from "./util/NotFoundError.mjs";

const createUserFormValidator = [
    body("username")
        .notEmpty().withMessage("Username field must not be empty")
        .isAlpha().withMessage("Username field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Username field must contain a maximum of 30 characters"),
    body("firstName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("First Name field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("First Name field must contain a maximum of 30 characters"),
    body("lastName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Last Name field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("First Name field must contain a maximum of 30 characters")
]

const searchUserFormValidator = [
    query("username")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Username field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("Username field must contain a maximum of 30 characters"),
    query("firstName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("First Name field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("First Name field must contain a maximum of 30 characters"),
    query("lastName")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Last Name field must only contain alphabetical characters")
        .isLength({ max: 30 }).withMessage("First Name field must contain a maximum of 30 characters")
]

const userDetailsGet = asyncHandler(async (req, res)  => {
    const userDetails = await db.getUserDetails(req.params.userId);

    if (!userDetails) {
        throw new NotFoundError(`User with id ${req.params.userId} not found`);
    }

    res.render("userDetails", {
        username: userDetails.username,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName
    });
})

const usersListSearchGet = [
    searchUserFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render("usersList", { errors: errors });
            return;
        }
        
        const usersList = await db.getUsersSearchList({
            username: req.query.username,
            firstName: req.query.firstName,
            lastName: req.query.lastName
        });
    
        if (usersList.length === 0) {
            res.status(404).send("error page");
        }
        res.render("usersList", { users: usersList });
    })
]

const createUserPageGet = asyncHandler(async (req, res) => {
    res.render("createUser");
})

const createUserPost = [
    createUserFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render("createUser", { errors: errors });
            return;
        }

        await db.insertUser({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })

        res.redirect("/users");
    })
]

const usersListGet = asyncHandler(async (req, res) => {
    const usersList = await db.getUserList();
    res.render("usersList", { users: usersList });
})




const updateUserPageGet = asyncHandler(async (req, res) => {
    const userDetails = await db.getUserDetails(req.params.userId);

    if (!userDetails) {
        throw new NotFoundError(`User with id ${req.params.userId} not found`);
    }

    res.render("userUpdate", {
        username: userDetails.username,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName
    });
})

const updateUserPost = [
    createUserFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render("updateUser", { errors: errors });
            return;
        }
        
        if (!db.userExists(req.params.userId)) {
            throw new NotFoundError(`User with id ${req.params.userId} not found`);
        }

        await db.updateUser(req.params.userId, {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })

        res.redirect("/users");
    })
]

const deleteUserPost = asyncHandler(async (req, res) => {
    if (!await db.userExists("req.params.userId")) {
        res.redirect("/users");
    }

    await db.deleteUser(req.params.userId);
    res.redirect("/users");
})

export { userDetailsGet, usersListSearchGet, createUserPageGet, createUserPost, usersListGet, updateUserPageGet, updateUserPost, deleteUserPost }