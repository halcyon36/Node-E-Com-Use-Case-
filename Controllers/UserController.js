import User from "../Models/User.js";
export const GetAllUsers = async (req,res,next)=>
{
    try
    {
        const users = await User.findAll();
        return res.status(200).json({statusCode:200,message:users});
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetAllUsers',message:err.message,capturedDateTime:Date.now()})
    }
}
export const GetUserById = async(req,res,next)=>
{
    try
    {
        const {id:userId} = req.params
        if(!userId) throw {statusCode:400,message:'Invalid Request, UserId is missing'}
        const user = await User.findOne({where:{Id:userId}})
        if(!user) throw {statusCode:404,message:`User with ${userId} not found`}
        return res.status(200).json({statusCode:200,message:user})
    }
    catch(err)
    {
        return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
    }
}
export const CreateUser = async(req,res,next)=>
{
    try
    {
        const userDetails = {...req.body}
        console.log(userDetails)
        const newUser = await User.create(userDetails) 
        return res.status(200).json({statusCode:200,message:newUser})
    }
    catch(err)
    {
        console.log(err)
        return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
    }
}
export const CreateBulkUsers = async(req,res,next)=>
{
    try
    {
        const userDetails = [...req.body]
        const newUser = await User.bulkCreate(userDetails) 
        return res.status(200).json({statusCode:200,message:`${userDetails.length} Users created successfully`,records:newUser})
    }
    catch(err)
    {
        console.log(err)
        return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
    }
}

export const UpdateUser = async(req,res,next)=>
{
    try
    {
        const {id:userId} = req.params
        if(!userId) throw {statusCode:400,message:'Invalid Request, UserId is missing'}
        const user = await User.findOne({where:{Id:userId}})
        if(!user) throw {statusCode:404,message:`User with ${userId} not found`}
        const updatedUser = await user.update({...req.body})
        return res.status(200).json({statusCode:200,message:updatedUser})
    }
    catch(err)
    {
        return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
    }
}
export const DeleteUser = async(req,res,next)=>
{
    try
    {
        const {id:userId} = req.params
        if(!userId) throw {statusCode:400,message:'Invalid Request, UserId is missing'}
        const user = await User.findOne({where:{Id:userId}})
        if(!user) throw {statusCode:404,message:`User with ${userId} not found`}
        await user.destroy();
        return res.status(200).json({statusCode:200,message:`User with ${userId} deleted successfully`})
    }
    catch(err)
    {
        return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
    }
}
export const getUserAddress = async(req,res,next)=>
{
    try
    {
        const userAddressList = await req.user.getUserAddresses()
        return res.status(200).json({statusCode:200, message:`User:${req.user.Id} addresses fetched `,result:userAddressList})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:400,message:err.message})       
    }
}
export const addUserAddress = async(req,res,next)=>
{
    try
    {
        let {AddressType, AddressLine1, AddressLine2, ZipCode, City, State, Country} = req.body
        console.log({AddressType, AddressLine1, AddressLine2, ZipCode, City, State, Country})
        if(!AddressType) AddressType = 'other'
        if(!AddressLine1 || !AddressLine2 || !ZipCode || !City || !State || !Country) return res.status(422).json({statusCode:422, message:'Invalid request, field\'s missing'})
        await req.user.createUserAddress({AddressType, AddressLine1, AddressLine2, ZipCode, City, State, Country,Id:req.user.Id})
        return res.status(200).json({statusCode:200, message:`User:${req.user.Id} address added successfully`})
    }
    catch(err)
    {
        console.log(err)
        return res.status(400).json({statusCode:400,message:err.message})       
    }
}
export const setDefaultAddress = async(req,res,next)=>
{
    try
    {
        const {id:addressId} = req.params
        if(!addressId) new Error(`Invalid request, Address identifier is missing`)
        const userAddress = (await req.user.getUserAddresses({where:{Id:addressId}}))[0]
        if(!userAddress) return res.status(400).json({statusCode:400, message:`User Addresses are empty, Please add to continue`})
        userAddress.AddressType = 'default'
        await userAddress.save()
        return res.status(200).json({statusCode:200, message:`User:${req.user.Id} Default address setted successfully`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:400,message:err.message})       
    }
}
