import asyncHandler from "express-async-handler";
import { body, query, validationResult } from "express-validator";

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

const userDetailsGet = asyncHandler(async (req, res)  => {
    const userDetails = { userDetails: "blah blah blah" };
    console.log("user details query");

    if (!userDetails) {
        res.status(404).send("error page");
    }

    res.send("user details view");
})

const usersListSearchGet = asyncHandler(async (req, res) => {
    const usersList = [ { usersList: "blah blah blah" } ];
    console.log(`users search list query with ${req.query}`);

    if (usersList.length === 0) {
        res.status(404).send("error page");
    }
    res.send("usersList view");
})

const createUserPageGet = asyncHandler(async (req, res) => {
    console.log("Create user form view");
    res.send("Create user form view");
})

const createUserPost = [
    createUserFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Render createUserPageGet");
            res.status(400).send("Create user page view component");
            return;
        }

        console.log(`add insert house with ${req.body}`);
        res.redirect("/users");
    })
]

const usersListGet = asyncHandler(async (req, res) => {
    const usersList = [ { usersList: "blah blah blah" } ];
    console.log("users list query");

    if (usersList.length === 0) {
        res.status(404).send("error page");
    }

    res.send("usersList view");
})




const updateUserPageGet = asyncHandler(async (req, res) => {
    const userDetails = { userDetails: "blah blah blah" };
    console.log(`users search query with ${req.params.userId}`)

    if (!userDetails) {
        res.status(404).send("error page");
    }

    res.send("userUpdate view");
})

const updateUserPost = [
    createUserFormValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Render updateUserPageGet with user id/info");
            res.status(400).send("Update user page view component");
            return;
        }
        
        console.log(`Update user query with ${req.body} & ${req.params.userId}`);
        res.redirect("/users");
    })
]

const deleteUserPost = asyncHandler(async (req, res) => {
    console.log(`Delete user query with ${params.userId}`);
    res.redirect("/users");
})

export { userDetailsGet, usersListSearchGet, createUserPageGet, createUserPost, usersListGet, updateUserPageGet, updateUserPost, deleteUserPost }