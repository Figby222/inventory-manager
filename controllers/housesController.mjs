import asyncHandler from "express-async-handler";

const houseDetailsGet = asyncHandler(async (req, res) => {
    const houseDetails = { houseDetails: "blahblahblah" }
    console.log("house details query");
    res.send("house details view");
    if (!houseDetails) {
        res.status(404).send("error page");
    }
})

export { houseDetailsGet }