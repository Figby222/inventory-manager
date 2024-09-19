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

async function updateAmenity(amenityId, query) {
    await Pool.query(format(`
        UPDATE amenities
        SET amenity_name = %1$L
        WHERE amenities.id = %2$L
    `, query.amenity_name, amenityId))
}

async function createAmenity(query) {
    await Pool.query(format(`
            INSERT INTO amenities(amenity_name)
            VALUES (
                %1$L
            )
        `,
        query.amenity_name
    ))
}

async function deleteAmenity(amenityId) {
    await Pool.query(format(`
        DELETE
        FROM amenities
        WHERE amenities.id= %1$L
        RETURNING *
    `, amenityId))
}

export default { getAmenityDetails, getAmenitiesSearchList, updateAmenity, createAmenity, deleteAmenity };