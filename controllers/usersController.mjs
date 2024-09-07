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

const newUserPost = asyncHandler(async (req, res) => {
    console.log(`add insert house with ${req.body}`);
    res.redirect("/users");
})

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

const updateUserPost = asyncHandler(async (req, res) => {
    console.log(`Update user query with ${req.body} & ${req.params.userId}`);
    res.redirect("/users");
})

export { userDetailsGet, usersListSearchGet, newUserPost, usersListGet, updateUserPageGet, updateUserPost }