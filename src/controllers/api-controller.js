const { sequelize } = require('../utils/sequelize')
const { DataTypes, QueryTypes, Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const hl7utils = require('../utils/hl7')

// Import Models
const { ClientRequests } = require('../models/ClientRequests')
const { AttributeMappings } = require('../models/AttributeMappings')
const { Models } = require('../models/Models')
const { ModelAttributes } = require('../models/ModelAttributes')
const { Clients } = require('../models/Clients')
const { ClientMappings } = require('../models/ClientMappings')
const { ClientsModels } = require('../models/ClientsModels')
const { Validations } = require('../models/Validations')
const { ModelValidations } = require('../models/ModelValidations')
const { Preprocessors } = require('../models/Preprocessors')
const { ModelPreprocessors } = require('../models/ModelPreprocessors')
const { GenerateConnection } = require('../utils/sequelize')
const { GenerateTransformerScript } = require('../utils/mirthScripts')

// Import preprocessor dependencies
const preprocessing_scripts = require('../utils/preprocessorScripts.json')
const { calculateAge, calculateSecondsDays, CalculateDateSeconds } = require('../utils/preprocessing-funcs')

const CreateRequest = async (req, res) => {
    const new_sequelize = GenerateConnection()

    // Get current date and time in the specified timezone
    const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Lisbon' });

    // Convert the local date and time to Unix timestamp
    const currentTimestamp = new Date(now).getTime()

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

const GetAllAttributeMappingsByModelAndAttribute = async (req, res) => {
    const { model_name, model_attribute } = req.params
    const all_attribute_mappings = await AttributeMappings.findAll({
        where: {
            attribute: model_attribute,
            model_name
        }
    })

    return res.send(all_attribute_mappings)
}

const GetAllAttributeMappingsByModel = async (req, res) => {
    const model_name = req.params.model_name;
    const attributeMappings = await AttributeMappings.findAll({
        where: {
            model_name
        }
    });

    // Count unique attributes
    const uniqueAttributes = {};
    attributeMappings.forEach(mapping => {
        const attribute = mapping.attribute;
        if (uniqueAttributes.hasOwnProperty(attribute)) {
            uniqueAttributes[attribute]++;
        } else {
            uniqueAttributes[attribute] = 1;
        }
    });

    // Convert uniqueAttributes object to an array of objects
    const result = Object.keys(uniqueAttributes).map(attribute => ({
        attribute,
        count: uniqueAttributes[attribute]
    }));

    return res.send(result);
};


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

const GetHl7Types = async (req, res) => {
    const all_hl7_types = await hl7utils.getHl7MessageTypes()
    return res.send(all_hl7_types)
}


const GetHl7Triggers = async (req, res) => {
    const hl7_triggers = await hl7utils.getHl7MessageTriggers()
    return res.send(hl7_triggers)
}

const GetHl7Segments = async (req, res) => {
    const hl7_segments = await hl7utils.getHl7MessageSegments()
    return res.send(hl7_segments)
}

const GetHl7Fields = async (req, res) => {
    const msg_segment = req.params.msg_segment
    const hl7_fields = await hl7utils.getHl7MessageFields(msg_segment)
    return res.send(hl7_fields)
}

const GetHl7SubFields = async (req, res) => {
    const hl7_field = req.params.hl7_field
    const hl7_subfields = await hl7utils.getHl7MessageSubFields(hl7_field)
    return res.send(hl7_subfields)
}

const GetClientMappings = async (req, res) => {
    const { client_id, model } = req.params
    const mirth = req.query.mirth

    //Checking if client has permissions to access model

    const permissions = await ClientsModels.findOne({
        where: {
            client_id,
            model_name: model
        }
    })

    if (!permissions || permissions.access !== 'ok') {
        return res.send({
            status: 500,
            client_mappings: []
        })
    }

    // Fetch all Model attributes and id

    const model_data = await Models.findOne({
        where: {
            model_name: model
        }
    })

    const model_attributes = await ModelAttributes.findAll({
        where: {
            model_id: model_data.model_id
        }
    })

    // Checking Mappings for each attribute

    let all_mappings = []
    for (let i = 0; i < model_attributes.length; i++) {
        const model_attribute = model_attributes[i];
        let mapping;

        mapping = await ClientMappings.findOne({
            where: {
                field: model_attribute.name,
                client_id
            }
        })

        if (!mapping) {
            mapping = await ClientMappings.findOne({
                where: {
                    field: model_attribute.name,
                    client_id: 'Default'
                }
            })
        }

        all_mappings.push(mapping)

    }
    return res.send({
        status: 200,
        client_mappings: all_mappings,
        model_id: model_data.model_id
    })

}

const CreateClientMapping = async (req, res) => {
    const { client_id, model, model_id, mappings } = req.body

    let client_mappings = []
    for (let i = 0; i < mappings.length; i++) {
        const single_mapping = mappings[i];
        const transformer_script = GenerateTransformerScript(single_mapping)
        client_mappings.push({
            client_id,
            model,
            model_id,
            field: single_mapping['field'],
            mapping: single_mapping['mapping'],
            msg_type: single_mapping.msg_type,
            msg_triggers: JSON.stringify(single_mapping.msg_triggers),
            transformer_script: transformer_script
        })

    }

    const db_res = await ClientMappings.bulkCreate(client_mappings)

    return res.send(db_res)
}

const GetClientModels = async (req, res) => {
    const client_id = req.params.client_id

    const models = await Models.findAll()

    let final_permissions = []

    for (let i = 0; i < models.length; i++) {
        const model = models[i];
        const models_permission = await ClientsModels.findOne({
            where: {
                client_id,
                model_id: model.model_id
            }
        })

        if (models_permission) {
            final_permissions.push(models_permission)
        } else {
            final_permissions.push({
                client_id,
                model_id: model.model_id,
                model_name: model.model_name,
                description: model.description,
                access: 'denied'
            })
        }
    }

    return res.send(final_permissions)
}

const DeleteClientModels = async (req, res) => {
    const rel_id = req.params.rel_id

    await ClientsModels.destroy({
        where: {
            rel_id
        }
    })

    return res.send('Client Model Permission deleted successfully')
}

const CreateClientModels = async (req, res) => {
    const { client_id, client_name, model_id, model_name } = req.body

    const new_client_model = await ClientsModels.create({
        client_id,
        client_name,
        model_id,
        model_name,
        access: 'ok'
    })

    return res.send(new_client_model)
}

const DefaultCheck = async (req, res) => {
    const { model_id, field } = req.params

    const mapping = await ClientMappings.findOne({
        where: {
            client_id: 'Default',
            model_id,
            field
        }
    })

    if (mapping) return res.send({ status: 200, message: 'exists', mapping })

    return res.send({ status: 500, message: 'does not exist' })
}

const RunPreprocessors = async (req, res) => {
    const req_obj = req.body.pred_obj
    const model = req.params.model

    // Get all field names using Object.keys()
    const fields = Object.keys(req_obj);

    let preprocessed_obj = {}
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const db_result = await ModelPreprocessors.findOne({
            where: {
                model_id: model,
                field
            },
            attributes: ['preprocessor_script']
        })

        let raw_field = req_obj[field]
        let processed_field

        if (!db_result) {
            preprocessor_scripts
            await eval(preprocessor_scripts['direct'])
        } else {
            await eval(db_result['preprocessor_script'])
        }

        preprocessed_obj[field] = processed_field
    }

    return res.send({
        proc_obj: preprocessed_obj
    })
}

// This function is meant to be used by the scripts in the database
const DBLookup = async (attribute, value, model_id) => {
    const attribute_value = await AttributeMappings.findOne({
        where: {
            attribute,
            value,
            model_id
        },
        attributes: ['mapping']
    })

    if (attribute_value) {
        return attribute_value['mapping']
    } else {
        return 0
    }
}


const DeleteClientMapping = async (req, res) => {
    const mapping_id = req.params.mapping_id

    await ClientMappings.destroy({
        where: { mapping_id: mapping_id }
    })

    return res.send('Client Mapping Deleted Successfully')
}

const UpdateClientMapping = async (req, res) => {
    const { mapping_id, changes } = req.body

    await ClientMappings.update(
        {
            mapping: changes.mapping,
            msg_type: changes.msg_type,
            msg_triggers: JSON.stringify(changes.msg_triggers)
        },
        { where: { mapping_id: mapping_id } }
    )

    return res.send('Mapping updated successfully')
}

const GetPreprocessingOptions = async (req, res) => {
    const options_names = Object.keys(preprocessing_scripts)

    const options_names_antd = options_names.map(item => ({
        label: item,
        value: item
    }));

    return res.send(options_names_antd)
}

const GetValidations = async (req, res) => {
    const validations = await Validations.findAll()

    return res.send(validations)
}

const CreateValidation = async (req, res) => {
    const { validation_name, description, validation_expression } = req.body

    const created_validation = await Validations.create({
        validation_name,
        description,
        validation_expression
    })

    return res.send(created_validation)


}

const GetModelValidations = async (req, res) => {
    const { model_id, field } = req.params

    const validations = await ModelValidations.findOne({
        where: {
            model_id,
            field
        }
    })

    if (validations !== null) {
        return res.send({ status: 200, validations })
    } else {
        return res.send({ status: 404, message: 'not found' })
    }

    return res.send(validations)
}

const CreateModelValidation = async (req, res) => {
    const { model_id, model_name, field, validation_name } = req.body

    let validation_expression
    let description

    if (validation_name === 'custom') {
        validation_expression = req.body.validation_expression
        description = req.body.description
    } else {
        db_validation = await Validations.findOne({ where: { validation_name } })

        validation_expression = db_validation.validation_expression
        description = db_validation.description
    }

    const new_model_validation = await ModelValidations.create(
        {
            model_id,
            model_name,
            field,
            validation_name,
            description,
            validation_expression
        }
    )

    return res.send(new_model_validation)
}

const GetPreprocessors = async (req, res) => {
    const preprocessors = await Preprocessors.findAll()

    return res.send(preprocessors)
}

const CreatePreprocessors = async (req, res) => {
    const { preprocessor_name, description, preprocessor_script } = req.body

    const created_preprocessor = await Preprocessors.create(
        {
            preprocessor_name,
            description,
            preprocessor_script
        }
    )

    return res.send(created_preprocessor)
}

const GetModelPreprocessors = async (req, res) => {
    const { model_id, field } = req.params

    const preprocessor = await ModelPreprocessors.findOne({
        where: {
            model_id,
            field
        }
    })

    if (preprocessor !== null) {
        return res.send({ status: 200, preprocessor })
    } else {
        return res.send({ status: 404, message: 'not found' })
    }

}

const CreateModelPreprocessors = async (req, res) => {
    const { model_id, model_name, field, preprocessor_name } = req.body

    let preprocessor_script
    let description

    if (preprocessor_name === 'custom') {
        preprocessor_script = req.body.preprocessor_script
        description = req.body.description
    } else {
        db_preprocessor = await Preprocessors.findOne({ where: { preprocessor_name } })

        preprocessor_script = db_preprocessor.preprocessor_script
        description = db_preprocessor.description
    }

    const new_model_validation = await ModelPreprocessors.create(
        {
            model_id,
            model_name,
            field,
            preprocessor_name,
            description,
            preprocessor_script
        }
    )

    return res.send(new_model_validation)
}

const DeleteModelPreprocessors = async (req, res) => {
    const preprocessor_id = req.params.preprocessor_id

    await ModelPreprocessors.destroy({ where: { preprocessor_id } })

    return res.send('Model Preprocessor Deleted Successfully')
}

const RunValidations = async (req, res) => {
    const req_obj = req.body.pred_obj
    const model_id = req.params.model_id

    // Get all field names using Object.keys()
    const fields = Object.keys(req_obj);

    let is_valid = true

    let validated_obj = {}
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const db_result = await ModelValidations.findOne({
            where: {
                model_id,
                field
            },
            attributes: ['validation_expression']
        })

        // Remove the leading and trailing slashes if present
        const trimmedRegexString = db_result['validation_expression'].replace(/^\/|\/$/g, '');

        const attribute_regex = new RegExp(trimmedRegexString)
        const validation_response = attribute_regex.test(req_obj[field])

        if (validation_response !== true) is_valid = false

        validated_obj[field] = { validation_response, regex: db_result['validation_expression'] }
    }

    return res.send({
        is_valid,
        validated_obj
    })
}

const DeleteModelValidations = async (req, res) => {
    const validation_id = req.params.validation_id

    await ModelValidations.destroy({
        where: {
            validation_id
        }
    })

    return res.send('Model validation deleted successfully')
}

const DeleteValidations = async (req, res) => {
    const validation_id = req.params.validation_id

    await Validations.destroy({
        where: {
            validation_id
        }
    })

    return res.send('Validation deleted successfully')
}

const DeletePreprocessors = async (req, res) => {
    const preprocessor_id = req.params.preprocessor_id

    await Preprocessors.destroy({
        where: {
            preprocessor_id
        }
    })

    return res.send('Preprocessor deleted successfully')
}

const CheckClientMappings = async (req, res) => {
    const { model_id, client_id, field } = req.params
    let result = await ClientMappings.findOne({
        where: {
            model_id,
            client_id,
            field
        }
    })
    console.log(result)

    if (!result) {
        result = await ClientMappings.findOne({
            where: {
                model_id,
                client_id: 'Default',
                field
            }
        })

        if(!result) result = 'not found'

        return res.send({
            mapping_type: 'default',
            mapping: result
        })
    } else {

        return res.send({
            mapping_type: 'custom',
            mapping: result
        })


    }

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
    DeleteAttributeMapping: DeleteAttributeMapping,
    GetHl7Types: GetHl7Types,
    GetHl7Triggers: GetHl7Triggers,
    GetHl7Segments: GetHl7Segments,
    GetHl7Fields: GetHl7Fields,
    GetHl7SubFields: GetHl7SubFields,
    GetAllAttributeMappingsByModel: GetAllAttributeMappingsByModel,
    GetAllAttributeMappingsByModelAndAttribute: GetAllAttributeMappingsByModelAndAttribute,
    GetClientMappings: GetClientMappings,
    CreateClientMapping: CreateClientMapping,
    GetClientModels: GetClientModels,
    CreateClientModels: CreateClientModels,
    DefaultCheck: DefaultCheck,
    RunPreprocessors: RunPreprocessors,
    DeleteClientMapping: DeleteClientMapping,
    UpdateClientMapping: UpdateClientMapping,
    GetPreprocessingOptions: GetPreprocessingOptions,
    GetValidations: GetValidations,
    CreateValidation: CreateValidation,
    GetModelValidations: GetModelValidations,
    CreateModelValidation: CreateModelValidation,
    GetPreprocessors: GetPreprocessors,
    CreatePreprocessors: CreatePreprocessors,
    GetModelPreprocessors: GetModelPreprocessors,
    CreateModelPreprocessors: CreateModelPreprocessors,
    DeleteModelPreprocessors: DeleteModelPreprocessors,
    RunValidations: RunValidations,
    DeleteModelValidations: DeleteModelValidations,
    DeleteValidations: DeleteValidations,
    DeletePreprocessors: DeletePreprocessors,
    DeleteClientModels: DeleteClientModels,
    CheckClientMappings: CheckClientMappings
}