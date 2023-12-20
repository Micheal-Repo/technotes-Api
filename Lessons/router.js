const path = require("path")
const express = require("express")
//const {Clogger,logger} = require("./Middleware/Logger")
const router = express.Router()

router.get("^/$|/index(.html)?",(req,res)=>{
  
  res.sendFile(path.join(__dirname,"views","index.html"))
  
  console.log("working ")
})

//router.get("/user",Clogger)


module.exports = router;