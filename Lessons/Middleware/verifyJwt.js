const jwt = require("jsonwebtoken")
const {jwtDecode} = require("jwt-decode")

const verifyJwt = (req,res,next)=>{
  const authHeader = req.headers.authorization || req.headers.Authorization
  
  console.log("header")
  console.log(authHeader)
  
  if(!authHeader?.startsWith("Bearer ")){
    return res.status(401).json({message:"unauthorized, token does not start wit bearer"})
  }
  
  const token = authHeader.split(" ")[1]
  
  
  console.log(`Token: ${token}`)
  
  if(!token){
    return res.status(400).json({message:"there's no token"})
  }
  
  const decoded = jwtDecode(token)
  console.log(decoded)
    
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err,decoded)=>{
      console.log(decoded)
      if(err){
          console.log(`error verifying token:${err.message}`) 
          
        return res.status(403).json({message:"Forbidden, access token expired"})
      }
      req.user = decoded.username
      req.roles = decoded.roles
      next()
    })
}

module.exports = verifyJwt