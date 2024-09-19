import Pool from "./pool.mjs";
import format from "pg-format";
async function getCategoryDetails(categoryId) {
    const { rows } = await Pool.query(format(`
        SELECT id, category_name
        FROM categories
        WHERE categories.id = %1$L
    `, categoryId))

    return rows[0];
}

async function getCategoriesSearchList(query) {
    const { rows } = await Pool.query(format(`
        SELECT id, category_name
        FROM categories
        WHERE LOWER(category_name) LIKE LOWER(%1$L)
    `, ('%' + query.category_name + '%')))

    return rows;
}

export default { getCategoryDetails, getCategoriesSearchList }