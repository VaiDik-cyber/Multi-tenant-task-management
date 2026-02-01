const db = require('../config/db');

class Organization {
    static async create(name) {
        const [result] = await db.query(
            'INSERT INTO organizations (name) VALUES (?)',
            [name]
        );
        return result.insertId;
    }
}

module.exports = Organization;
