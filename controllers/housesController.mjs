import asyncHandler from "express-async-handler";

const houseDetailsGet = asyncHandler(async (req, res) => {
    const houseDetails = { houseDetails: "blahblahblah" }
    console.log("house details query");
    res.send("house details view");
    if (!houseDetails) {
        res.status(404).send("error page");
    }
})

const housesListSearchGet = asyncHandler(async (req, res) => {
    const houseList = [ { houseList: "blah blah blah" } ]
    console.log(`house list search query ${req.query}`);

    if (houseList.length === 0) {
        res.status(404).send("error page");
    }
    res.send("houseList view");
})

const newHousePost = asyncHandler(async (req, res) => {
    console.log(`Add insert house into db with ${req.body}`);
    res.redirect("/houses");
})

const housesListGet = asyncHandler(async (req, res) => {
    const houseList = [ { houseList: "blah blah blah" } ]
    console.log("house list query");

    if (houseList.length === 0) {
        res.status(404).send("error page");
    }

    res.send("houseList view");
})

export { houseDetailsGet, housesListSearchGet, newHousePost, housesListGet }