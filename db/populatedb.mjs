import pg from "pg";
const { Client } = pg;
import "dotenv/config";

const SQL = `CREATE TABLE IF NOT EXISTS houses (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR ( 30 ) NOT NULL,
    price NUMERIC(10) CONSTRAINT positive_price CHECK (price > 0) NOT NULL,
    sale_status VARCHAR ( 30 ),
    furniture_status VARCHAR ( 30 ),
    bedroom_count NUMERIC(4) NOT NULL,
    bathroom_count NUMERIC(5, 1) NOT NULL,
    square_footage NUMERIC(6) CONSTRAINT positive_square_footage CHECK (square_footage > 0) NOT NULL,
    house_number NUMERIC(7) CONSTRAINT positive_house_number CHECK (house_number > 0) NOT NULL,
    street VARCHAR ( 30 ) NOT NULL,
    city VARCHAR ( 30 ) NOT NULL,
    state VARCHAR ( 30 ) NOT NULL,
    zip_code NUMERIC ( 5 ) CONSTRAINT zip_code_digit_check CHECK (zip_code BETWEEN 0 AND 99999) NOT NULL,
    country VARCHAR ( 30 ) DEFAULT 'United States',
    listing_agent_id INTEGER
);


CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    amenity_name VARCHAR ( 255 ) NOT NULL
    );

CREATE TABLE IF NOT EXISTS amenities_connection (
    house_id INTEGER REFERENCES houses (id) ON DELETE CASCADE NOT NULL,
    amenity_id INTEGER REFERENCES amenities (id) ON DELETE CASCADE NOT NULL
);


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 30 ) UNIQUE NOT NULL,
    first_name VARCHAR ( 30 ),
    last_name VARCHAR ( 30 )
    );

CREATE TABLE IF NOT EXISTS owners_connection (
    house_id INTEGER REFERENCES houses (id) ON DELETE CASCADE NOT NULL,
    owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE NOT NULL
);
    
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    image_src TEXT NOT NULL,
    view_index NUMERIC ( 3 ) CONSTRAINT positive_view_index CHECK (view_index >= 0) NOT NULL,
    house_id INTEGER REFERENCES houses (id) ON DELETE CASCADE NOT NULL,
    UNIQUE (house_id, view_index)
);


CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR ( 30 ) NOT NULL
    );
    
CREATE TABLE IF NOT EXISTS categories_connection (
    house_id INTEGER REFERENCES houses (id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE
);

ALTER TABLE houses 
    ADD CONSTRAINT houses_listing_agent_fk FOREIGN KEY (listing_agent_id)
    REFERENCES users (id) ON DELETE RESTRICT;

INSERT INTO users (username, first_name, last_name) 
    VALUES 
    ('Figby222', 'Figby', '222'),
    ('cookies2', 'cookies', 'cookies'),
    ('cookies3', 'cookies', 'cookies'),
    ('cookies4', 'cookies', 'cookies');

INSERT INTO houses (title, price, sale_status, furniture_status, bedroom_count, bathroom_count, square_footage, house_number, street, city, state, zip_code, listing_agent_id) 
    VALUES ('Ryan''s Estate', 21000000, 'Purchased', 'Not furnished', 44, 44.5, 64000, 64, 'Awesome street', 'Awesome City', 'Awesome State', 64000, 1);


INSERT INTO owners_connection (house_id, owner_id) 
    VALUES (1, 1);

INSERT INTO categories (category_name)
VALUES
    ('Modern'),
    ('Big'),
    ('Hillside'),
    ('Ocean view');

INSERT INTO categories_connection (house_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);

INSERT INTO amenities (amenity_name)
VALUES 
    ('Pool'),
    ('Garden'),
    ('Sauna'),
    ('Steam room');

INSERT INTO amenities_connection (house_id, amenity_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);
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