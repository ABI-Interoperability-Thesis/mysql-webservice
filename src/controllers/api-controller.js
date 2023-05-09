const { sequelize } = require('../utils/sequelize')
const { DataTypes, QueryTypes, Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


// Import Models
const { ClientRequests } = require('../models/ClientRequests')
const { AttributeMappings } = require('../models/AttributeMappings')
const { Models } = require('../models/Models')
const { ModelAttributes } = require('../models/ModelAttributes')
const { Clients } = require('../models/Clients')
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

const MatchAttribute = async (req, res) => {
    const { attribute, value } = req.body

    try {
        const attribute_value = await AttributeMappings.findOne({
            where: {
                attribute,
                value
            },
            attributes: ['mapping']
        })
        return res.send(attribute_value.mapping)
    } catch (error) {
        return res.status(404).send(`No mapping found for ${attribute} = ${value}`)
    }
}

const GetAllRequests = async (req, res) => {
    const all_requests = await ClientRequests.findAll();

    return res.send(all_requests)
}

const DeleteRequest = async (req, res) => {
    const { request_id, table_name } = req.params
    await ClientRequests.destroy({
        where: { model_data_id: request_id }
    })

    const deleteQuery = `DELETE FROM ${table_name} WHERE req_id = "${request_id}"`;

    await sequelize.query(deleteQuery, { type: QueryTypes.DELETE })
    return res.send('Row deleted successully')
}

const CreateModel = async (req, res) => {
    const { model_name, description, attributes } = req.body

    const uniqueID = uuidv4()
    const new_model = await Models.create({
        model_id: uniqueID,
        model_name: model_name,
        description: description,
        deployed: false,
        attribute_count: attributes.length
    })

    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const new_attribute = {
            model_id: uniqueID,
            name: attribute.name,
            description: attribute.description,
            type: attribute.data_type
        }

        await ModelAttributes.create(new_attribute)

    }

    return res.send(`Model ${model_name} created with ${attributes.length} attributes`)
}

const GetModels = async (req, res) => {
    const all_models = await Models.findAll()

    return res.send(all_models)
}

const GetModel = async (req, res) => {
    const model_id = req.params.model_id
    const model = await Models.findOne({
        where: {
            model_id
        }
    })

    return res.send(model)
}

const GetModelAttributes = async (req, res) => {
    const model_id = req.params.model_id
    const model_attributes = await ModelAttributes.findAll({
        where: {
            model_id
        }
    })

    return res.send(model_attributes)
}

const CreateClient = async (req, res) => {
    const { email, name, phone } = req.body
    const uniqueID = uuidv4()

    const created_client = await Clients.create({
        client_id: uniqueID,
        email,
        name,
        phone
    })

    return res.send(created_client)
}

const GetClients = async (req, res) => {
    const all_clients = await Clients.findAll()
    return res.send(all_clients)
}

const GetSingleClient = async (req, res) => {
    const client_id = req.params.client_id

    const client = await Clients.findOne({
        where: {
            client_id
        }
    })

    return res.send(client)
}

const DeleteClient = async (req, res) => {
    const client_id = req.params.client_id
    const deleted_client = await Clients.destroy({
        where: { client_id }
    })

    console.log(deleted_client)

    return res.send('ok')
}

const GetAllAttributeMappings = async (req, res) => {
    const all_attribute_mappings = await AttributeMappings.findAll()

    return res.send(all_attribute_mappings)
}

const CreateAttributeMappings = async (req, res) => {
    const {attribute, model_id, model_name, mappings} = req.body

    const prepared_data = mappings.map((mapping)=>{
        return {
            model_id,
            attribute,
            model_name,
            value: mapping.value,
            mapping: mapping.mapping
        }
    })

    const created_mappings = await AttributeMappings.bulkCreate(prepared_data)

    return res.send(created_mappings)
}

module.exports = {
    CreateRequest: CreateRequest,
    UpdateRequest: UpdateRequest,
    MatchAttribute: MatchAttribute,
    GetAllRequests: GetAllRequests,
    DeleteRequest: DeleteRequest,
    CreateModel: CreateModel,
    GetModels: GetModels,
    GetModelAttributes: GetModelAttributes,
    GetModel: GetModel,
    CreateClient: CreateClient,
    GetClients: GetClients,
    GetSingleClient: GetSingleClient,
    DeleteClient: DeleteClient,
    GetAllAttributeMappings: GetAllAttributeMappings,
    CreateAttributeMappings: CreateAttributeMappings
}