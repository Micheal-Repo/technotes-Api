const {format} = require("date-fns")
const {v4:uuid} = require("uuid")
const fs = require("fs")
const fsPromise = require("fs").promises
const path= require("path")


const logEvents =async(message,logsFileName)=>{
  
  
  const dateTime = format(new Date(),'yyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`
  
  try{
  if(!fs.existsSync(path.join(__dirname,"..","logs"))){
    await fsPromise.mkdir(path.join(__dirname,"..","logs"))
  }
  await fsPromise.appendFile(path.join(__dirname,"..","logs",logsFileName),logItem)
  
}catch(err){
  console.log(err.message)
}
  
}






const logger =(req,res,next)=>{
  
//   if(req.url.includes("user")){
//   logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,"UserLog.log")
// console.log(`${req.method} sent to log`)
//   next()
//   }else{
//     console.log(`${req.url} does not includes user`)
//   }
logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,"reqLog.log")
 console.log(`${req.headers.origin} sent to log`)
  next()
}


module.exports = {logger,logEvents}