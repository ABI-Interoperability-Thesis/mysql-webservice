const {CreateTableDB} = require('../utils/mysql')

const CreateTable = async (req,res) =>{
    const {model_name, mappings} = req.body
    const create_table_res = await CreateTableDB(model_name, mappings)
    return res.send(create_table_res)
    
}

module.exports = {
    CreateTable: CreateTable
}