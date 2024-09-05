function getRootRoute(req, res) {
    res.render("index", { title: "Inventory Manager" });
}

export { getRootRoute };