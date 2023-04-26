const endpoints = require('../config/endpoints.json')
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const runtime_env = process.env.ENV
const endpoint = endpoints['mysql'][runtime_env]
const db_user = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: endpoint,
    dialect: 'mysql'
});

const PrepareDB = async () => {
    try {
        await sequelize.sync();
    } catch (error) {
        res.send({
            message: 'there was an error',
            error
        })
    }
}

module.exports = {
    PrepareDB: PrepareDB,
    sequelize: sequelize
}