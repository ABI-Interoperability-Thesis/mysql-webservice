const endpoints = require('../config/endpoints.json')
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const runtime_env = process.env.ENV
const endpoint = endpoints['mysql'][runtime_env]
const db_user = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

const pre_load_data = require('../db_pre_data/data.json')

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: endpoint,
    dialect: 'mysql'
});

const GenerateConnection = () => {
    const sequelize_conn = new Sequelize(db_name, db_user, db_password, {
        host: endpoint,
        dialect: 'mysql'
    });

    return sequelize_conn
}

const PrepareDB = async () => {
    try {
        await sequelize.sync();
        PreloadData()
    } catch (error) {
        console.log({
            message: 'there was an error',
            error
        })
    }
}

const PreloadData = async () => {
    const { Validations } = require('../models/Validations')
    const { Preprocessors } = require('../models/Preprocessors')

    console.log('Creating preloaders')
    const pre_validators = pre_load_data['validators']
    const pre_preprocessors = pre_load_data['preprocessors']

    for (const pre_validator of pre_validators) {
        await Validations.findOrCreate({
            where: { validation_name: pre_validator.validation_name, description: pre_validator.description, validation_expression: pre_validator.validation_expression }, // Condition based on email to check if the user exists.
            defaults: pre_validator,
        });
    }

    for (const pre_preprocessor of pre_preprocessors) {
        await Preprocessors.findOrCreate({
            where: { preprocessor_name: pre_preprocessor.preprocessor_name, description: pre_preprocessor.description, preprocessor_script: pre_preprocessor.preprocessor_script }, // Condition based on email to check if the user exists.
            defaults: pre_preprocessor,
        });
    }

}


module.exports = {
    PrepareDB: PrepareDB,
    sequelize: sequelize,
    GenerateConnection: GenerateConnection
}