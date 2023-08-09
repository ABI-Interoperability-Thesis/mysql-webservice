const { Accounts } = require('../models/Accounts')
const { Clients } = require('../models/Clients')
const { Issues } = require('../models/Issues')
const { IssueMessages } = require('../models/IssueMessages')
const { ClientRequests } = require('../models/ClientRequests')
const { ClientMappings } = require('../models/ClientMappings')
const { ModelAttributes } = require('../models/ModelAttributes')
const { Models } = require('../models/Models')
const { ModelValidations } = require('../models/ModelValidations')
const { ModelPreprocessors } = require('../models/ModelPreprocessors')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ClientsModels } = require('../models/ClientsModels')

const CreateAccount = async (req, res) => {
    const { username, password } = req.body

    //Encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const created_account = await Accounts.create({
        username,
        password: hashedPassword
    })

    return res.send(created_account)
}

const Login = async (req, res) => {
    const { username, password } = req.body

    const account = await Accounts.findOne({
        where: {
            username
        }
    })

    if (!account) {
        return res.send({
            status: 500,
            message: 'unauthorized'
        })
    }

    //Comparing the entered password with the one stored in the database
    const validPassword = await bcrypt.compare(password, account.password);

    if (!validPassword) return res.send({
        status: 500,
        message: 'unauthorized'
    });

    console.log(account)

    const payload = {
        account_id: account.account_id,
        username: account.username,
        password: account.password
    }
    const secretKey = 'this_is_a_very_secret_key';
    const token = jwt.sign(payload, secretKey);

    return res.send({
        token
    })
}

const IsLoggedIn = async (req, res) => {
    return res.send({
        status: 200,
        message: 'logged in',
        account_data: req.user
    })
}

const GenerateClientToken = async (req, res) => {
    const payload = {
        client_id: req.user.client_id
    }

    const secretKey = 'this_is_a_very_secret_key_clients';
    const token = jwt.sign(payload, secretKey);

    return res.send({
        token
    })
}

const ClientLogin = async (req, res) => {
    const { email, password } = req.body

    const existing_client = await Clients.findOne({
        where: {
            email
        }
    })

    if (!existing_client) return res.send({ status: 404, message: 'Client does not exist' })

    //Comparing the entered password with the one stored in the database
    const validPassword = await bcrypt.compare(password, existing_client.password);

    if (!validPassword) return res.send({
        status: 500,
        message: 'unauthorized'
    });

    const payload = {
        client_id: existing_client.client_id,
        email: existing_client.email,
        name: existing_client.name,
        phone: existing_client.phone,
    }

    const secretKey = 'this_is_a_very_secret_key_clients';
    const token = jwt.sign(payload, secretKey);

    return res.send({
        token
    })
}

const ChangePassword = async (req, res) => {
    const { password, new_password } = req.body
    const client_id = req.user.client_id

    const existing_client = await Clients.findOne({
        where: {
            client_id
        }
    })

    if (!existing_client) return res.send({ status: 404, message: 'Client does not exist' })

    //Comparing the entered password with the one stored in the database
    const validPassword = await bcrypt.compare(password, existing_client.password);

    if (!validPassword) return res.send({
        status: 500,
        message: 'unauthorized'
    });

    //Encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    const updated_client = await Clients.update({
        password: hashedPassword
    }, {
        where: {
            client_id
        }
    })

    return res.send({
        status: 200,
        message: 'password changed successfully',
    })

}

const CreateIssue = async (req, res) => {
    const { issue_type, issue_title, message } = req.body

    const created_date = Date.now()

    const created_issue = await Issues.create({
        issue_type,
        issue_title,
        client_id: req.user.client_id,
        client_name: req.user.name,
        answered: false,
        created: created_date
    })

    const created_message = await IssueMessages.create({
        issue_id: created_issue.issue_id,
        sent_by_id: req.user.client_id,
        sent_by_name: req.user.name,
        message,
        created: created_date
    })

    return res.send({
        created_issue,
        created_message
    })
}

const GetIssues = async (req, res) => {
    const client_issues = await Issues.findAll({
        where: {
            client_id: req.user.client_id
        }
    })

    return res.send(client_issues)
}

const GetAllIssues = async (req, res) => {
    const client_issues = await Issues.findAll({})
    return res.send(client_issues)
}

const GetIssueMessages = async (req, res) => {
    const issue_id = req.params.issue_id

    const issue_messages = await IssueMessages.findAll({
        where: {
            issue_id
        }
    })

    return res.send(issue_messages)
}

const DeleteIssue = async (req, res) => {
    const issue_id = req.params.issue_id

    await Issues.destroy({
        where: {
            issue_id
        }
    })

    await IssueMessages.destroy({
        where: {
            issue_id
        }
    })

    return res.send('Issue and Issue Messages Deleted Successfully')

}

const GetIssueDetails = async (req, res) => {
    const issue_id = req.params.issue_id

    const issue_metadata = await Issues.findOne({
        where: {
            issue_id
        }
    })

    const issue_messages = await IssueMessages.findAll({
        where: {
            issue_id
        }
    })

    return res.send({
        issue_metadata,
        issue_messages
    })
}

const CreateIssueMessage = async (req, res) => {
    const { issue_id, sent_by_id, sent_by_name, message } = req.body
    const created_date = Date.now()
    const created_message = await IssueMessages.create({
        issue_id,
        sent_by_id,
        sent_by_name,
        message,
        created: created_date
    })

    return res.send(created_message)
}

const UpdateIssueState = async (req, res) => {
    const issue_id = req.params.issue_id
    const new_state = req.body.new_state

    const updated_issue = await Issues.update({
        answered: new_state
    }, {
        where: {
            issue_id
        }
    })

    return res.send(updated_issue)
}

const GetRequests = async (req, res) => {
    const client_id = req.user.client_id

    const client_requests = await ClientRequests.findAll({
        where: {
            client_id
        }
    })

    return res.send(client_requests)

}

const GetModels = async (req, res) => {
    const deployed_models = await Models.findAll({
        where: {
            deployed: true
        }
    })

    return res.send(deployed_models)
}

const GetRequestsInfo = async (req, res) => {
    const client_id = req.user.client_id
    const total_requests = await ClientRequests.count({ where: { client_id } })
    const answered_requests = await ClientRequests.count({ where: { answered: 1, client_id } })
    const unanswered_requests = await ClientRequests.count({ where: { answered: 0, client_id } })

    return res.send({
        total_requests,
        answered_requests,
        unanswered_requests
    })
}

const GetRequestsInfoByModel = async (req, res) => {
    const client_id = req.user.client_id

    const client_permissions = await ClientsModels.findAll({ where: { client_id } })

    let final_res = []

    for (let i = 0; i < client_permissions.length; i++) {
        const model_id = client_permissions[i].model_id;
        const model_name = client_permissions[i].model_name;

        const total_requests = await ClientRequests.count({ where: { request_type: model_name, client_id } })
        const answered_requests = await ClientRequests.count({ where: { answered: 1, request_type: model_name, client_id } })
        const unanswered_requests = await ClientRequests.count({ where: { answered: 0, request_type: model_name, client_id } })

        final_res.push({
            model_id,
            model_name,
            total_requests,
            answered_requests,
            unanswered_requests
        })
    }

    return res.send(final_res)
}

const GetIssuesInfo = async (req, res) => {
    const client_id = req.user.client_id

    const open_issues = await Issues.count({ where: { answered: 0, client_id: client_id } })
    const closed_issues = await Issues.count({ where: { answered: 1, client_id: client_id } })

    return res.send({
        client_id,
        open_issues,
        closed_issues
    })
}

const GetModelDetails = async (req, res) => {
    const model_id = req.params.model_id
    const client_id = req.user.client_id

    const model = await Models.findOne({ where: { model_id } })

    const model_attributes = await ModelAttributes.findAll({ where: { model_id } })

    let attribute_configs = []

    for (let i = 0; i < model_attributes.length; i++) {
        const model_attribute = model_attributes[i];

        let attribute_mapping
        attribute_mapping = await ClientMappings.findOne({
            where: {
                client_id,
                field: model_attribute.name,
                model_id
            }
        })

        if (!attribute_mapping) {
            attribute_mapping = await ClientMappings.findOne({
                where: {
                    client_id: "Default",
                    field: model_attribute.name,
                    model_id
                }
            })
        }

        const attribute_validator = await ModelValidations.findOne({
            where: {
                model_id,
                field: model_attribute.name
            }
        })

        const attribute_preprocessor = await ModelPreprocessors.findOne({
            where: {
                model_id,
                field: model_attribute.name
            }
        })

        attribute_configs.push({
            ...model_attribute.dataValues,
            attribute_mapping,
            attribute_validator,
            attribute_preprocessor
        })

    }

    const client_permission_exists = await ClientsModels.findOne({ where: { client_id, model_id } })

    const client_permission = client_permission_exists ? true : false

    return res.send({
        model,
        attribute_configs,
        client_permission
    })
}

const GetUserInfo = async (req, res) => {
    const client_id = req.user.client_id

    const user_info = await Clients.findOne({ where: { client_id } })

    return res.send(user_info)
}

module.exports = {
    CreateAccount: CreateAccount,
    Login: Login,
    IsLoggedIn: IsLoggedIn,
    GenerateClientToken: GenerateClientToken,
    ClientLogin: ClientLogin,
    CreateIssue: CreateIssue,
    GetIssues: GetIssues,
    GetIssueMessages: GetIssueMessages,
    DeleteIssue: DeleteIssue,
    GetIssueDetails: GetIssueDetails,
    CreateIssueMessage: CreateIssueMessage,
    UpdateIssueState: UpdateIssueState,
    GetAllIssues: GetAllIssues,
    GetRequests: GetRequests,
    GetModels: GetModels,
    GetRequestsInfo: GetRequestsInfo,
    GetRequestsInfoByModel: GetRequestsInfoByModel,
    GetIssuesInfo: GetIssuesInfo,
    GetModelDetails: GetModelDetails,
    GetUserInfo: GetUserInfo,
    ChangePassword: ChangePassword
}