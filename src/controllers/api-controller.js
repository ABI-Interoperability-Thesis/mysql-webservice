const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

// Import Models
const {ClientRequests} = require('../models/ClientRequests')

const CreateRequest = async (req, res) => {
    const { table_name, values } = req.body
    const {Table} = require(`../models/${table_name}.js`)
    // Sync with db to create tables if they dont exist
    await sequelize.sync()
    const new_row = await Table.create(values)

    const new_req = await ClientRequests.create({
        model_data_id: new_row.req_id,
        answered: false,
        answer: 'none',
        request_type: table_name,
        client_id: '123'
    })

    return res.send(new_row)

}

module.exports = {
    CreateRequest: CreateRequest
}