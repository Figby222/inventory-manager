import Pool from "./pool.mjs";
import format from "pg-format";
async function getUserDetails(userId) {
    const { rows } = await Pool.query(format(`
        SELECT id, username, first_name, last_name
        FROM users
        WHERE users.id = %1$L
    `, userId))

    return rows[0];
}

async function getUsersSearchList(query) {
    const { rows } = await Pool.query(format(`
        SELECT username, first_name, last_name
        FROM users
        WHERE LOWER(username) LIKE LOWER(%1$L)
        ${!!query.first_name ? "AND LOWER(first_name) LIKE LOWER(%2$L)" : ""}
        ${!!query.last_name ? "AND LOWER(last_name) LIKE LOWER(%3$L)" : ""}
    `, ('%' + query.username + '%'), ('%' + query.first_name + '%'), ('%' + query.last_name + '%')))

    return rows;
}

async function updateUser(userId, query) {
    await Pool.query(format(`
        UPDATE users
        SET username = %1$L,
        first_name = %2$L,
        last_name = %3$L
        WHERE users.id = %4$L
    `, query.username, query.first_name, query.last_name, userId))
}

async function createUser(query) {
    await Pool.query(format(`
            INSERT INTO users (username, first_name, last_name)
            VALUES (
                %1$L,
                %2$L,
                %3$L
            )
        `,
        query.username,
        query.first_name,
        query.last_name
    ))
}

async function deleteUser(userId) {
    await Pool.query(format(`
        DELETE
        FROM users
        WHERE users.id = %1$L
        RETURNING *
    `, userId))
}

async function getUsersList() {
    const { rows } = await Pool.query(`
        SELECT id, username, first_name, last_name
        FROM users
    `)

    return rows;
}

async function userExists(userId) {
    const { rows } = await Pool.query(format(`
        SELECT id FROM users
        WHERE users.id = %1$L
    `, userId))

    return !!rows[0];
}

export default { getUserDetails, getUsersSearchList, updateUser, createUser, deleteUser, getUsersList, userExists }