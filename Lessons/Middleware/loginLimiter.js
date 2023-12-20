const rateLimiter = require("express-rate-limit")
const {logEvents} = require("./Logger")

const loginLimiter = rateLimiter({
  windowMs : 60 * 1000,
  max : 100,
  message:{
    message:"Too many login attempts from this IP, please try again after a 60 second pause"
  },
  handler:(req,res,next,options)=>{
    logEvents(`Too many Requests : ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,"errLog.log")
    res.staus(options.statusCode).send(options.message)
  },
  
  standardHeaders:true,
  legacyHeaders:false
  
})

module.exports = loginLimiter