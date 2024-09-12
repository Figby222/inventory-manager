import Pool from "./pool.mjs";
import format from "pg-format";

async function getHouseDetails(houseId) {
    const house = (await Pool.query(`
        SELECT title, price, CONCAT(house_number, ' ', street, ', ', city, ', ', state, ', ', country, ', ', zip_code) as address,
        bedroom_count, bathroom_count, furniture_status, owner.username AS owner_name, listing_agent.username AS listing_agent_name
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

export default { getHouseDetails, getHousesSearchList }