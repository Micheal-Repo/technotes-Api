//http://localhost:3000
require("dotenv").config();
require("express-async-errors")
const express = require("express")
const path = require("path")
const router= require("./router.js")
const app = express()
const cors = require("cors")
const mongoose= require("mongoose")
const cookieParser = require("cookie-parser")

const {logger,logEvents} = require("./Middleware/Logger")
const {errorHandler} = require("./Middleware/errorHandler")
const corsOption = require("./configs/corsOptions")
const connectDB = require("./configs/dbConn")

//Router
const userRouter = require("./routes/userRouter")
const noteRouter = require("./routes/notesRouter")
const authRouter = require("./routes/authRouter")

const userModel = require("./Models/User")
const noteModel = require("./Models/Note")




//extra
const Hash = require("./Extra/bcryptjs")

const PORT = process.env.PORT || 3000


connectDB()
Hash()
//Middleware
app.use(cors(corsOption))
app.use(logger)
app.use("/",router)
app.use("/",express.static(path.join(__dirname,"/public")))
app.use(express.json())
app.use(cookieParser())

//end point
app.use("/users",userRouter)
app.use("/notes",noteRouter)
app.use("/auth",authRouter)
app.use("/",(req,res)=>{
  console.log(req.url)
})

//all
app.all("*",(req,res)=>{
  res.status(404)
  if(req.accepts("html")){
    res.sendFile(path.join(__dirname,"views","404.html"))
  }else if(req.accepts("json")){
    res.json({message:"404 page not found"})  
  }else{
    res.type(txt).send("404 not found")
  };
  
})


const text = "micheal,ezeogu"
const textArray= text.split(",")
const isStart = text.startsWith("micheal")
console.log(textArray)
console.log(isStart)

app.use(errorHandler)

//mongoose connection
mongoose.connection.once("open",()=>{
console.log("connected")

app.listen(PORT,()=> console.log(`server is listening to port ${PORT}`))
})

mongoose.connection.on("error",(err)=>{
  console.log(err.message)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log")
})

mongoose.connection.on("disconnected",()=>{
  console.log("pls check your internet connection and try again")
})

mongoose.connection.on("connected",()=>{
  console.log("back online")
})






