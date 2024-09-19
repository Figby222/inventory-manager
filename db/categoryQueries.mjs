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

export default { getCategoryDetails }