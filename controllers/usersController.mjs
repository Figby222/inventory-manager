import asyncHandler from "express-async-handler";

const userDetailsGet = asyncHandler(async (req, res)  => {
    const userDetails = { userDetails: "blah blah blah" };
    console.log("user details query");

    if (!userDetails) {
        res.status(404).send("error page");
    }

    res.send("user details view");
})

export { userDetailsGet }