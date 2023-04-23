require('dotenv').config();
const mysql = require('mysql2')
const endpoints = require('../config/endpoints.json')

const runtime_env = process.env.ENV
const endpoint = endpoints['mysql'][runtime_env]
const db_user = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

const connection = mysql.createConnection({
    host: endpoint,
    user: db_user,
    password: db_password,
    database: db_name
});

const PrepareDB = () => {
    const query = `
    CREATE TABLE IF NOT EXISTS client_requests (
        model_data_id varchar(40) NOT NULL,
        answered tinyint DEFAULT '0',
        answer varchar(120) DEFAULT 'none',
        request_type varchar(100) DEFAULT NULL,
        client_id int DEFAULT NULL,
        PRIMARY KEY (model_data_id),
        UNIQUE KEY model_data_id_UNIQUE (model_data_id),
        KEY model_data_id_idx (model_data_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      
    `
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log('Database Ready');
    });
}

const CreateTableDB = async (model_name, mappings) => {
    let query = `
    CREATE TABLE IF NOT EXISTS  ${model_name} (
        data_id varchar(40) NOT NULL,`

    for (let i = 0; i < mappings.length; i++) {
        const mapping = mappings[i];
        const new_mapping = `${mapping.name} varchar(120) DEFAULT NULL,`
        query += new_mapping

    }

    query += `PRIMARY KEY (data_id),
        UNIQUE KEY data_id_UNIQUE (data_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='		';
      `

    await connection.execute(query);
    return {
        status: 200,
        message: 'Operation ran successfully'
    }
}

module.exports = {
    PrepareDB: PrepareDB,
    CreateTableDB: CreateTableDB
}