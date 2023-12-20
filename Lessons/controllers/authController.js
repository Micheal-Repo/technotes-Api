
const userModel = require("../Models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


//console.log(process.env.REFRESH_TOKEN_SECRET)
//login
//POST 
const login =async(req,res)=>{
  const {username, password} = req.body

  console.log(req.body)
//   //verify body
if(!username || !password){
   return res.status(400).json({message:"All fields are required"})
}
console.log("login")
     //check username existence
   const User = await userModel.findOne({username}).exec()
   
   console.log("user loding")
   console.log(User)
   if(!User){
      return res.status(400).json({message:"invalid username "})
   }

  if(!User.active){
    return res.status(401).json({message:"user has been deactivated"})
 }
  
    //compare password
  const match = await bcrypt.compare(password,User.password)
  
   if(!match){
   return res.status(401).json({message:"invalid password"})
}
  
  //Token
  console.log(User.roles)
const AccessToken = jwt.sign(
   {
    "username":User.username,
    "roles":User.roles

  },
     process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : "10s"}
   )
 console.log(`AcessToken: ${AccessToken}`)
  const RefreshToken = jwt.sign(
    { "username":User.username },
     process.env.REFRESH_TOKEN_SECRET,
   {expiresIn:"1d"}
   )
 console.log(`RefreshToken: ${RefreshToken}`)
  
//  cookies
console.log("sending cookies")
res.cookie("jwt",RefreshToken,{
 httpOnly:true,
   secure:true,
  sameSite:"None",
   maxAge:7*24*60*60*1000
 })
console.log("sent cookies")
 

 res.json({AccessToken})
  
}


//refresh 
//get 
const refresh =(req,res)=>{
  const cookies = req.cookies
 // const cookies = req.cookies
  //verify cookies
  console.log(req.cookies)
  
  if(!cookies?.jwt){
    return res.status(401).json({message:"Unauthorized no cookies"})
  }
  console.log("cookies verified")
  
  const RefreshToken = cookies.jwt
  console.log(RefreshToken)
  
  jwt.verify(
    RefreshToken, 
    process.env.REFRESH_TOKEN_SECRET,async(err,decoded)=>{
    console.log(decoded)
    console.log("refreshing")
    //verify password 
    if(err){
      return res.status(403).json({message:"forbidden, invalid refreshToken"})
    }
    console.log("refresh verified")
    
    //verify user
    const User = await userModel.findOne({username:decoded.username}).exec()
    
    if(!User){
      return res.status(403).json({message:"forbidden"})
    }
    
    console.log(User)
    //generate another access yoken
    console.log("sending new token")
    const AccessToken = jwt.sign(
   {
       "username":User.username,
       "roles":User.roles 
     
  },
     process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : "10s"}
   )
   
   console.log(`new token : ${AccessToken}`)
    //res
   res.json({token:AccessToken})
  })
}


//logout
//POST
const logout =(req,res)=>{
  const cookies = req.cookies
  console.log("logging out")
 if(!cookies?.jwt){
 return res.status(204)
  }
  
   res.clearCookie("jwt",{
   httpOnly:true,
   secure:true,
   sameSite:"None"
  })
  console.log("cookie cleared")
  res.json({message:"Cookie cleared"})
}


module.exports ={
  login,
  refresh,
  logout
}