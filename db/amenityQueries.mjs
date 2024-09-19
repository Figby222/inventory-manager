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

async function getAmenitiesSearchList(query) {
    const { rows } = await Pool.query(format(`
        SELECT id, amenity_name
        FROM amenities
        WHERE LOWER(amenity_name) LIKE LOWER(%1$L)
    `, ('%' + query.amenity_name + '%')))

    return rows;
}

export default { getAmenityDetails, getAmenitiesSearchList };