import pg from "pg";
const { Client } = pg;
import "dotenv/config";

const SQL = `CREATE TABLE IF NOT EXISTS houses (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    price NUMERIC(10) CONSTRAINT positive_price CHECK (price > 0) NOT NULL,
    sale_status VARCHAR ( 30 ) NOT NULL,
    furnature_status VARCHAR ( 30 ) NOT NULL,
    bedroom_count NUMERIC(4) NOT NULL,
    square_footage NUMERIC(6) CONSTRAINT positive_square_footage CHECK (square_footage > 0) NOT NULL,
    house_number NUMERIC(7) CONSTRAINT positive_house_number CHECK (house_number > 0) NOT NULL,
    street VARCHAR ( 30 ) NOT NULL,
    city VARCHAR ( 30 ) NOT NULL,
    state VARCHAR ( 30 ) NOT NULL,
    zip_code NUMERIC ( 5 ) CONSTRAINT zip_code_digit_check CHECK (zip_code BETWEEN 0 AND 99999) NOT NULL,
    country VARCHAR ( 30 ) DEFAULT 'United States',
    listing_agent_id INTEGER REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS amenities_connection (
    house_id INTEGER REFERENCES houses (id) NOT NULL,
    amenity_id INTEGER REFERENCES amenities (id) NOT NULL
);

CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    amenity_name VARCHAR ( 255 ) NOT NULL
);

CREATE TABLE IF NOT EXISTS owners_connection (
    house_id INTEGER REFERENCES houses (id) NOT NULL,
    owner_id INTEGER REFERENCES users (id) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 30 ) UNIQUE NOT NULL,
    first_name VARCHAR ( 30 ),
    last_name VARCHAR ( 30 )
);

CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    house_id INTEGER REFERENCES houses (id) NOT NULL,
    image_href TEXT NOT NULL,
    view_index NUMERIC ( 3 ) CONSTRAINT positive_view_index CHECK (view_index >= 0) NOT NULL,
    UNIQUE (house_id, view_index)
);

CREATE TABLE IF NOT EXISTS categories_connection (
    house_id INTEGER REFERENCES houses (id) NOT NULL,
    category_id INTEGER REFERENCES categories (id) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR ( 30 ) NOT NULL
);
`

async function main() {
    console.log("seeding...")
    const client = new Client({
        connectionString: process.argv[2],
    });

    await client.connect();
    await client.query(SQL);
    await client.end();
    
    console.log("done");
}

main();