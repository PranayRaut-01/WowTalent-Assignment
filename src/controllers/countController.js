const countModel = require("../models/countModel")


const createCount = async (req,res)=>{
    try {
        const body = req.body
        const count = await countModel.create(body)
        return res.status(201).send({ status: true, data:count });

        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.createCount=createCount