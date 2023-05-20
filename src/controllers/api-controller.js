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
    const currentTimestamp = Date.now();
    const { table_name, values, client_id, values_pre_proc } = req.body

    const sqlz_obj = GenerateSequelizeTable(values)

    const table_options = {
        tableName: table_name,
        timestamps: false
    }

    const sqlz_obj_pre_proc = GenerateSequelizeTablePreProc(values)
    const table_name_pre_proc = table_name + '_pre_proc'

    const table_options_pre_proc = {
        tableName: table_name_pre_proc,
        timestamps: false
    }

    const NewTable = new_sequelize.define(table_name, sqlz_obj, table_options)
    const NewTablePreProc = new_sequelize.define(table_name_pre_proc, sqlz_obj_pre_proc, table_options_pre_proc)

    await new_sequelize.sync()
    const new_row = await NewTable.create(values)
    const new_row_pre_proc = await NewTablePreProc.create(values_pre_proc)

    const new_req = await ClientRequests.create({
        model_data_id: new_row.req_id,
        answered: false,
        answer: 'none',
        request_type: table_name,
        client_id: client_id,
        created_date: currentTimestamp
    })

    return res.send({
        new_row,
        new_req,
        new_row_pre_proc
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

const GenerateSequelizeTablePreProc = (values) => {
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
                type: DataTypes.INTEGER,
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
    const { attribute, value, model_name } = req.body
    const attribute_value = await AttributeMappings.findOne({
        where: {
            attribute,
            value,
            model_name
        },
        attributes: ['mapping']
    })

    if (attribute_value) {
        return res.status(200).send(attribute_value)
    } else {
        return res.status(200).send({ mapping: 0 })
    }

}

const GetAllRequests = async (req, res) => {
    const all_requests = await ClientRequests.findAll();

    return res.send(all_requests)
}

const DeleteRequest = async (req, res) => {
    const { request_id, table_name } = req.params
    const table_name_pre_proc = table_name + '_pre_proc'

    await ClientRequests.destroy({
        where: { model_data_id: request_id }
    })

    const deleteQuery = `DELETE FROM ${table_name} WHERE req_id = "${request_id}"`;
    const deleteQueryPreProc = `DELETE FROM ${table_name_pre_proc} WHERE req_id = "${request_id}"`;

    await sequelize.query(deleteQuery, { type: QueryTypes.DELETE })
    await sequelize.query(deleteQueryPreProc, { type: QueryTypes.DELETE })

    return res.send('Rows deleted successully')
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
    const { attribute, model_id, model_name, mappings } = req.body

    const prepared_data = mappings.map((mapping) => {
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

const GetRequestById = async (req, res) => {
    const req_id = req.params.req_id

    const client_request = await ClientRequests.findOne({
        where: {
            model_data_id: req_id
        }
    })

    const table_name_literal = client_request.request_type
    const table_name_pre_proc = client_request.request_type + '_pre_proc'

    const find_request_literal_query = `SELECT * FROM ${table_name_literal} WHERE req_id = "${req_id}"`;
    const find_request_pre_proc_query = `SELECT * FROM ${table_name_pre_proc} WHERE req_id = "${req_id}"`;

    const find_request_literal = await sequelize.query(find_request_literal_query, { type: QueryTypes.SELECT })
    const find_request_pre_proc = await sequelize.query(find_request_pre_proc_query, { type: QueryTypes.SELECT })


    const final_res = {
        client_request,
        find_request_literal: find_request_literal[0],
        find_request_pre_proc: find_request_pre_proc[0]
    }

    return res.send(final_res)
}

const DeleteModel = async (req, res) => {
    const model_id = req.params.model_id
    await Models.destroy({
        where: { model_id: model_id }
    })

    await ModelAttributes.destroy({
        where: { model_id: model_id }
    })

    return res.send('Model and Model attributes deleted')

}

const DeleteAttributeMapping = async (req, res) => {
    const attribute_mapping_id = req.params.attribute_mapping_id
    await AttributeMappings.destroy({
        where: { mapping_id: attribute_mapping_id }
    })

    return res.send('Attribute Mapping Deleted')

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
    CreateAttributeMappings: CreateAttributeMappings,
    GetRequestById: GetRequestById,
    DeleteModel: DeleteModel,
    DeleteAttributeMapping: DeleteAttributeMapping
}