import Pool from "./pool.mjs";
import format from "pg-format";
async function getAmenityDetails(amenityId) {
    const { rows } = await Pool.query(format(`
        SELECT id, amenity_name
        FROM amenities
        WHERE amenities.id = %1$L
    `, amenityId))

    return rows[0];
}

export default { getAmenityDetails };