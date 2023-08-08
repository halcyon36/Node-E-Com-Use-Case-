
import { Op } from "sequelize";
import Return from "../Models/Return.js";

export const GetReturn = async(req,res,next)=>
{
    try
    {
        const ReturnData = await Return.findAll()
        if(ReturnData)
        return res.status(200).json({statusCode:'200',message:`all return data`,data:ReturnData})
        else
        return res.status(200).json({statusCode:'200',message:`no return request`})
    }
    catch(err)  
    {
        return res.status(400).json({statusCode:'400',message:err.message})
    }

}


export const GetReturnById = async(req,res,next)=>
{
    try
    {
        const {id:returnId} = req.params
        console.log({id:returnId});
        const ReturnData = await Return.findOne({ where: {id:returnId} })
        if(ReturnData)
        return res.status(200).json({statusCode:'200',message:`all return data`,data:ReturnData})
        else
        return res.status(200).json({statusCode:'200',message:`no return request`})
    }
    catch(err)  
    {
        return res.status(400).json({statusCode:'400',message:err.message})
    }

}

export const AddReturn = async(req,res,next)=>
{
    const returnDetails = {...req.body}
    console.log(returnDetails);
    try
    {
        const createdReturn = await Return.create(returnDetails)
        return res.status(200).json({statusCode:'200',message:`Return: ${createdReturn.Id} placed`})     
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'ReturnOrder',message:err.message})
    }
}

export const CancelReturn = async(req,res,next)=>
{
    try
    {
        const {id:returnId} = req.params
        //console.log({id:returnId});
        if(!returnId) throw new Error(`Invalid request, returnId is missing`)
        const ReturnData = await Return.findOne({where:{Id:returnId}})
        //console.log(ReturnData);
        if(!ReturnData) throw new Error(`No return found with id `+returnId)
        const UpdateSuccess = await ReturnData.update({Status:"cancelled"})
        console.log(UpdateSuccess);
        if(!UpdateSuccess) throw new Error(`Internal Error `+UpdateSuccess)
        ReturnData.save()
        return res.status(200).json({statusCode:'200',message:`cancel successful`,result:{returnId}})           
    }   
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CancelReturn',message:err.message,capturedDateTime:Date.now()})
    }
}
