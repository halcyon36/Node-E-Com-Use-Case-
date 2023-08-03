import User from "../Models/User.js";
import { Op } from "sequelize";
import generateVerificationCode from "../Utils/generateVerificationCode.js";
import UserVerification from "../Models/UserVerification.js";
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
        const newUser = await User.create(userDetails) 
        if(newUser.IsSeller)
        {
            const seller = await newUser.createSeller({})
            console.log(`User:${newUser.Id} is registered as Seller:${seller.Id}`)
            return res.status(200).json({statusCode:200,message:`user:${newUser.Id} is created as seller successfully`,result:{
                User:newUser
            }})
        }
        return res.status(200).json({statusCode:200,message:`user:${newUser.Id} creation successful`,result:{
            User:newUser
        }})
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
export const getVerificationCode = async(req,res,next)=>
{
    try
    {
        let {length} = req.query
        const {id:userId} = req.params
        if(!userId) throw {statusCode:400,message:'Invalid request, userId is missing'}
        length = (length && length>12)?length:22
        if(!length) length=22
        const code = generateVerificationCode(length)
        const user = await User.findOne({where:{Id:userId}})
        if(!user) throw {statusCode:400,message:'Invalid request, user does not exists'}
        await UserVerification.destroy({where:{UserId:userId}})
        const details = {VerificationCode:code,ExpiresOn:new Date(Date.now()+3600 * 1000)}
        await user.createUserVerification(details)
        return res.status(200).json({statusCode:200,message:`verification code generated successfully for user:${userId}`,result:details})
    }
    catch(err)
    {
        return res.status(err.statusCode??400).json({statusCode:err.statusCode??'400',operation:'getVerificationCode',message:err.message,capturedDateTime:new Date(Date.now())})        
    }
}
export const verifyUserEmailPost = async(req,res,next)=>
{
    try
    {
        const {code:verificationCode} = req.params
        const {Email, Password} = req.body
        if(!verificationCode || !Email || !Password) throw {statusCode:422,message:`Invalid request, details are missing`}
        const foundUser = await User.findOne({where:{Email:Email}})
        if(!foundUser) throw {statusCode:404,message:`User:${Email} does not exists`}
        //password verification
        const UserVerificationCode = await foundUser.getUserVerification({where:{VerificationCode:verificationCode,ExpiresOn:{[Op.gte]:new Date(Date.now())}}})
        if(!UserVerificationCode) 
        {
            await UserVerification.destroy({where:{UserId:foundUser.Id}})
            throw {statusCode:422,message:`Verification code got expired`}
        }
        foundUser.IsActive = true
        await foundUser.save()
        await UserVerification.destroy({where:{UserId:foundUser.Id}})
        return res.status(200).json({statusCode:200,message:`User:${Email} verification successful`})
    }
    catch(err)
    {
        return res.status(err.statusCode??'400').json({statusCode:err.statusCode??'400',operation:'verifyUserEmail',message:err.message,capturedDateTime:new Date(Date.now())})        
    }
}
