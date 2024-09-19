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

async function updateCategory(categoryId, query) {
    await Pool.query(format(`
        UPDATE categories
        SET category_name = %1$L
        WHERE categories.id = %2$L
    `, query.category_name, categoryId))
}

async function createCategory(query) {
    await Pool.query(format(`
            INSERT INTO categories(category_name)
            VALUES (
                %1$L
            )
        `,
        query.category_name
    ))
}

export default { getCategoryDetails, getCategoriesSearchList, updateCategory, createCategory }