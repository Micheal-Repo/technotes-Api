const allowedOrigin = require("./allowedOrigin")

const corsOption ={
  
  origin :(origin,callback)=>{
  
  if(allowedOrigin.indexOf(origin) !== -1 || !origin){
    callback(null,true)
    console.log(origin)
  }else{
    callback(new Error("Not allowed by CORS"))
    console.log(origin)
  }
  },
  
  credentials:true,
  optionsSuccessStatus:200
  
  
}


module.exports = corsOption