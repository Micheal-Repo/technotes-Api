const bcrypt = require("bcryptjs")


const userModel = require("../Models/User")
const noteModel = require("../Models/Note")

const GetUser =async()=>{
  const users = await userModel.find({}).lean().exec()
  console.log(users)
}

//end point : http://localhost:5174


//get User
const getAllUser = async(req,res)=>{
  //console.log("start")
  const users = await userModel.find({}).select("-password").lean().exec()
  
  if(!users?.length){
     console.log("user not found")
     return res.status(400).json({message:"No Users Found"})
  }
  
  
  res.status(200).json(users)
  console.log("users sent to frontend")
  console.log(users)
  
    
  
}

//create uset || POST
const createUser = async(req,res)=>{
  console.log(req.body)
  
  
 const { username,password,roles }= req.body
 
  if(!username || !password || !Array.isArray(roles) || !roles.length){
     return res.status(400).json({message:"All field are required"})
   }
  
//check for duplicate 
   const duplicateUser = await userModel.findOne({username}).collation({locale:"en",strength:2}).lean().exec()
   if(duplicateUser){
   return res.status(400).json({message:"username already exist"})
   }
  
     //hash password
  const hashedPwd = await bcrypt.hash(password,10)
  
   //create user
const userObject = {
  username,
  "password":hashedPwd,
  roles
 }

const user = await userModel.create(userObject)
  
if(user){
     res.status(201).json({message:`user ${username} is register successfully`,id:user._id})
     console.log(user)
   
   }else{
   res.status(400).json({message:"fail to register user"})
     }
 
}

//update user || PATCH
const updateUser = async(req,res)=>{
  
   const {id, username,roles, active,password} = req.body
   
   console.log("updated")
   console.log(req.body)

  
   
  //confirm
  if(!username || !Array.isArray(roles) || !roles?.length || typeof active !== "boolean"){
  return  res.status(400).json({message:"all field are required "})
  }
   
   
 //check user exist
  const user = await userModel.findById(id).exec()
   
  if(!user){
  return res.status(400).json({message:"user not found"})
   }
   
  //check for duplicate
  const duplicate = await userModel.findOne({username}).collation({locale:"en",strength:2}).lean().exec()
   
   if(duplicate && duplicate?._id.toString() !== id){
    return res.status(400).json({message:"user already exist"})
   }
   
  //set info
  user.username=username,
  user.roles = roles,
  user.active = active
    if(password){
       const hashedPwd = bcrypt.hash(password,10)
       user.password = hashedPwd
    }
  
   const updatedUser= await user.save()
  
   res.status(200).json({message:`updated successfully`})
   console.log(updatedUser)
  
}

//delete uset || delete
const deleteUser =  async(req,res)=>{
 
console.log(req.body)
console.log("deleting")
 const {id} = req.body

 if(!id){
  return res.status(201).json({message:"user id required"})
   }
   
   //check if uset exist
 const user = await userModel.findById(id).lean().exec()
 
 if(!user){
  return res.status(201).json({message:"user not found"})
 }
 
 //check if user have an assigned notes
// const note = await noteModel.findOne({user:Id}).lean().exec()
 //if(note){
 // return res.status(201).json({message:"user is assigned a notes"})
// }
 
 const result = await userModel.findByIdAndDelete({_id: user._id})
 
 const reply = `user ${result.username} with id ${result._id} is deleted successfully`
 
 console.log(result)
 
 res.status(200).json({message :reply})

 }
 
 

module.exports = {
  getAllUser,
  createUser,
  updateUser,
  deleteUser
}