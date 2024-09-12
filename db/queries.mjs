import Pool from "./pool.mjs";

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

export default { getHouseDetails }