
import { Op } from "sequelize";
export const GetReturn = async(req,res,next)=>
{
    try
    {
        const userReturn = await req.user.getReturn()
        if(userReturn)
        return res.status(200).json({statusCode:'200',message:`User:${req.user.Id} has been initiated for return`,data:userReturn})
        else
        return res.status(200).json({statusCode:'200',message:`User:${req.user.Id} has no return request`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',message:err.message})
    }

}

export const ClearReturn = async(req,res,next)=>
{
    try
    {
        const userReturn = await req.user.getReturn()
        if(userReturn)
            await userReturn.destroy()
        return res.status(200).json({statusCode:'200',message:`User:${req.user.Id} return has been cleared successfully`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'userReturn',message:err.message,capturedDateTime:Date.now()})
    }
}

export const AddReturn = async(req,res,next)=>
{
    try
    {
        const userReturn = await req.user.createReturn({productId:req.params.pid,OrderId:req.params.oid,Reason:req.params.reason})
        return res.status(200).json({statusCode:'200',message:`Return: ${userReturn.Id} placed`})     
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
        if(!returnId) throw new Error(`Invalid request, returnId is missing`)
        const userReturn = await req.user.getReturn({where:{Id:returnId}})
        if(userReturn)
        {
            userReturn[0].Status = 'cancelled'
            await userReturn[0].save()
            return res.status(200).json({statusCode:'200',message:`Return: ${returnId} cancel successful`,result:{returnId:userReturn[0].Id}})         
        }
        else 
            return res.status(400).json({statusCode:'200',message:`Return: ${returnId} does not exists`})     
    }   
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CancelReturn',message:err.message,capturedDateTime:Date.now()})
    }
}
