import asyncHandler from "express-async-handler";

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

export { userDetailsGet, usersListSearchGet }