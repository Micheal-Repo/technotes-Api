const {logEvents}  = require("./Logger")

const errorHandler =(err,req,res,next)=>{
  
    logEvents(`${err.name}:${err.message}\t${req.url}\t${req.method}\t${req.headers.origin}`,"errLog.log")
    
    const status = res.statusCode ? res.statusCode : 500
    
    res.json({message: err.message,isError:true})
    console.log(err.message)
  
}


module.exports = {errorHandler}