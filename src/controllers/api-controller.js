const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

// Import Models
const { ClientRequests } = require('../models/ClientRequests')
const { GenerateConnection } = require('../utils/sequelize')
const CreateRequest = async (req, res) => {
    const new_sequelize = GenerateConnection()
    const { table_name, values } = req.body

    const sqlz_obj = GenerateSequelizeTable(values)

    const table_options = {
        tableName: table_name,
        timestamps: false
    }

    const NewTable = new_sequelize.define(table_name, sqlz_obj, table_options)

    await new_sequelize.sync()
    const new_row = await NewTable.create(values)

    const new_req = await ClientRequests.create({
        model_data_id: new_row.req_id,
        answered: false,
        answer: 'none',
        request_type: table_name,
        client_id: '123'
    })

    return res.send({
        new_row,
        new_req
    })

}

const GenerateSequelizeTable = (values) => {
    let sqlz_obj = {}
    Object.entries(values).forEach(([field, value]) => {
        if (field === 'req_id') {
            sqlz_obj[field] = {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
                autoIncrement: false
            }
        } else {
            sqlz_obj[field] = {
                type: DataTypes.STRING,
                allowNull: true,
            }
        }
    })

    return sqlz_obj
}

const UpdateRequest = (req, res) => {

    const { req_id, answer } = req.body

    ClientRequests.update(
        { answered: true, answer: answer },
        { where: { model_data_id: req_id } }
    )
        .then((result) => {
            console.log(result);
            return res.send(result)
        })
        .catch((error) => {
            console.error(error);
            return res.send(error)
        });

}

module.exports = {
    CreateRequest: CreateRequest,
    UpdateRequest: UpdateRequest
}