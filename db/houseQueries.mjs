import Pool from "./pool.mjs";
import format from "pg-format";

async function getHouseDetails(houseId) {
    const house = (await Pool.query(`
        SELECT title, price, CONCAT(house_number, ' ', street, ', ', city, ', ', state, ', ', country, ', ', zip_code) as address,
        bedroom_count, bathroom_count, square_footage, furniture_status, owner.username AS owner_name, listing_agent.username AS listing_agent_name
        FROM houses
        JOIN owners_connection ON houses.id=owners_connection.house_id
        JOIN users owner ON owners_connection.owner_id=owner.id
        JOIN users listing_agent ON listing_agent_id=listing_agent.id
        WHERE houses.id = $1
    `, [houseId]))
        .rows[0];
    
    const images = (await Pool.query(`
        SELECT image_href as imageHref, view_index as viewIndex
        FROM images
        WHERE house_id = $1
        ORDER BY viewIndex
    `, [houseId]))
        .rows;
    
    const amenities = (await Pool.query(`
        SELECT amenity_name
        FROM amenities
        JOIN amenities_connection
        ON amenities.id = amenities_connection.amenity_id
        WHERE amenities_connection.house_id = $1
    `, [houseId]))
        .rows;
    
    const categories = (await Pool.query(`
        SELECT category_name
        FROM categories
        JOIN categories_connection 
        ON categories.id=categories_connection.category_id
        WHERE categories_connection.house_id = $1
    `, [houseId]))
        .rows;

    return { house, images, amenities, categories };
}

async function getHousesSearchList(query) {
    const housesList = (await Pool.query(
        format(`
            SELECT DISTINCT houses.id, title, price, bedroom_count, bathroom_count, square_footage, CONCAT(house_number, ' ', street, ', ', city, ', ', state, ', ', country, ', ', zip_code) as address
            FROM houses
            LEFT JOIN amenities_connection
            ON houses.id=amenities_connection.house_id
            LEFT JOIN amenities ON amenities_connection.amenity_id=amenities.id
            LEFT JOIN categories_connection ON houses.id=categories_connection.house_id
            LEFT JOIN categories ON categories_connection.category_id=categories.id
            WHERE LOWER(title) LIKE LOWER(%1$L)
            ${!!query.minimum_price ? "AND price >= %2$L" : ""}
            ${!!query.maximum_price ? "AND price <= %3$L" : ""}
            ${!!query.minimum_bedroom_count ? "AND bedroom_count >= %4$L" : ""}
            ${!!query.maximum_bedroom_count ? "AND bedroom_count <= %5$L" : ""}
            ${!!query.minimum_square_footage ? "AND square_footage >= %6$L" : ""}
            ${!!query.maximum_square_footage ? "AND square_footage <= %7$L" : ""}
            ${!!query.furniture_status ? "AND LOWER(furniture_status) LIKE LOWER(%8$L)" : ""}
            ${!!query.category_ids ? "AND categories.id IN (%9$L)" : ""}
            ${!!query.amenity_ids ? "AND amenities.id IN (%10$L)" : ""}
            
        `, 
        ("%" + query.title + "%"),
        query.minimum_price,
        query.maximum_price,
        query.minimum_bedroom_count,
        query.maximum_bedroom_count,
        query.minimum_square_footage,
        query.maximum_square_footage,
        ("%" + query.furniture_status + "%"),
        query.category_ids, 
        query.amenity_ids, 
)))
    .rows;

    return housesList;
}

async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i]);
    }
}

async function updateHouse(houseId, query) {
    await Pool.query(format(`
        UPDATE houses
        SET title = %1$L,
        price = %2$L,
        bedroom_count = %3$L,
        bathroom_count = %4$L,
        square_footage = %5$L,
        house_number = %6$L,
        street = %7$L,
        city = %8$L,
        state = %9$L,
        zip_code = %10$L,
        country = %11$L
        WHERE houses.id = %12$L
    `, query.title, query.price, query.bedroom_count, query.bathroom_count, query.square_footage, query.house_number, query.street, query.city, query.state, query.zip_code, query.country, houseId ))

    await Pool.query(format(`
        DELETE FROM amenities_connection
        WHERE house_id = %1$L
        ${!!query.amenity_ids.length ? "AND amenity_id NOT IN (%2$L)" : ""}
    `, houseId, query.amenity_ids))

    const amenityIdsToAdd = (await Pool.query(format(`
        SELECT amenities.id FROM amenities
        WHERE amenities.id IN (%2$L)
        AND amenities.id NOT IN (
            SELECT amenity_id FROM amenities_connection
            WHERE house_id = %1$L
            AND amenity_id IN (%2$L)
        )
    `, houseId, query.amenity_ids)))
        .rows;

    await asyncForEach(amenityIdsToAdd, async (row) => {
        await Pool.query(format(`
            INSERT INTO amenities_connection (house_id, amenity_id)
            VALUES (%1$L, %2$L)
        `, houseId, row.id))
    })

    await Pool.query(format(`
        DELETE FROM categories_connection
        WHERE house_id = %1$L
        ${!!query.category_ids.length ? "AND category_id NOT IN (%2$L)" : ""}
    `, houseId, query.category_ids))

    const categoryIdsToAdd = (await Pool.query(format(`
        SELECT categories.id FROM categories
        WHERE categories.id IN (%2$L)
        AND categories.id NOT IN (
            SELECT category_id FROM categories_connection
            WHERE house_id = %1$L
            AND category_id IN (%2$L)
        )
    `, houseId, query.category_ids)))
        .rows;

    await asyncForEach(categoryIdsToAdd, async (row) => {
        await Pool.query(format(`
            INSERT INTO categories_connection
            VALUES (%1$L, %2$L)
        `, houseId, row.id))
    })
}

async function createHouse(query) {
    const houseId = (await Pool.query(format(`
            INSERT INTO houses (title, price, sale_status, furniture_status, bedroom_count, bathroom_count, square_footage, house_number, street, city, state, zip_code, country, listing_agent_id)
            VALUES (
                %1$L,
                %2$L,
                %3$L,
                %4$L,
                %5$L,
                %6$L,
                %7$L,
                %8$L,
                %9$L,
                %10$L,
                %11$L,
                %12$L,
                %13$L,
                %14$L
            )
            RETURNING houses.id
        `, 
        query.title, 
        query.price, 
        query.sale_status, 
        query.furniture_status, 
        query.bedroom_count, 
        query.bathroom_count, 
        query.square_footage, 
        query.house_number, 
        query.street, 
        query.city, 
        query.state, 
        query.zip_code, 
        query.country, 
        query.listing_agent_id
    )))
        .rows[0].id;

    await asyncForEach(query.amenity_ids, async (amenity_id) => {
        await Pool.query(format(`
            INSERT INTO amenities_connection (house_id, amenity_id)
            VALUES (%1$L, %2$L)
        `, houseId, amenity_id))
    })

    await asyncForEach(query.category_ids, async (category_id) => {
        await Pool.query(format(`
            INSERT INTO categories_connection (house_id, category_id)
            VALUES (%1$L, %2$L)
        `, houseId, category_id))
    })
    
    await Pool.query(format(`
        INSERT INTO owners_connection (house_id, owner_id)
        VALUES (%1$L, %2$L)
        RETURNING *
    `, houseId, query.owner_id))
}

async function getAmenities() {
    const { rows } = await Pool.query(`
        SELECT * FROM amenities
    `)

    return rows;
}

async function getCategories() {
    const { rows } = await Pool.query(`
        SELECT * FROM categories
    `)

    return rows;
}

async function deleteHouse(houseId) {
    await Pool.query(format(`
        DELETE FROM houses
        WHERE houses.id = %1$L
    `, houseId))
}

async function getHousesList() {
    const { rows } = await Pool.query(`
        SELECT id, title, bedroom_count, bathroom_count, square_footage, CONCAT(house_number, ' ', street, ', ', city, ', ', state, ', ', country, ', ', zip_code) as address
        FROM houses
    `)

    return rows;
}

async function houseExists(houseId) {
    const { rows } = await Pool.query(format(`
        SELECT id
        FROM houses
        WHERE id = %1$L
    `, houseId))

    return !!rows[0];
}

export default { getHouseDetails, getHousesSearchList, updateHouse, createHouse, getAmenities, getCategories, deleteHouse, getHousesList, houseExists }