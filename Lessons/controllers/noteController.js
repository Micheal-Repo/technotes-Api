
const userModel = require("../Models/User")
const noteModel = require("../Models/Note")
const counterModel = require("../Models/Counter")


//getAllNotes
const getAllNotes = async(req,res)=>{
  
  //getAllNotes
  const notes = await noteModel.find().lean().exec()
  
  //check if there's notes
  if(!notes?.length){
    return res.status(400).json({message:"no Notes found"})
  }

  
  //attached username to each note
  const noteWithUser = await Promise.all(
    notes.map(async(note)=>{
      const user = await userModel.findById(note.user).lean().exec()
      return {...note,username:user?.username}
    })
    )
//  console.log(noteWithUser)
 res.json(noteWithUser)
 // res.json({message:"notes sent"})
  console.log("notes sent to frontend")
}

//createNewNote
const createNewNote = async(req,res)=>{
  const {user,title,text} = req.body
  console.log(req.body)
  //confirm data
  if(!user || !title || !text){
    return res.status(200).json({message:"all field required"})
  }
  
  //check for duplicate 
  const duplicate = await noteModel.findOne({title}).collation({locale:"en",strength:2}).lean().exec()
  
  
  if(duplicate){
    return res.status(200).json({message:"note title already exist"})
   }
   
 
   //couter & saving
   const getCounter = await counterModel.findOne({id:"ticket"})
   console.log(getCounter)
   let Ticket;
   if(!getCounter){
   const createdCounter = await counterModel.create({
     id:"ticket",
     ticket:500
   })
   
   console.log(createdCounter)
   Ticket = 500
   }else{
     
 const counter = await counterModel.findOneAndUpdate(
   {id:"ticket"},
   {"$inc":{"ticket":1}},
   {new:true})
   
   console.log(counter)
   Ticket = counter.ticket
  }
   
  
 
 
  
  //create object
  const createdNote = await noteModel.create({ user, title, text ,ticket:Ticket})
 
    console.log(createdNote)
    
  if(createdNote){
  return res.status(201).json({message:`note ${createdNote.title} is created successfully`})
  }else{
    return res.status(200).json({message:"invalid note"})
  }
  
}

//updateNote
const updateNote =async(req,res)=>{
  const {id,user,title,text, completed} = req.body
  
  console.log(req.body)
  //confirm data
if(!id || !user || !title || !text || typeof completed !== "boolean"){
  return res.status(400).json({message:"all field required"})
}

//chech note exist
 const note = await noteModel.findById(id).exec()
 
 if(!note){
   return res.status(400).json({message:"note not found"})
 }
 
 //check for update
 const duplicate = await noteModel.findOne({title}).collation({locale:"en",strength:2}).lean().exec()
 if(duplicate && duplicate?._id.toString() !== id){
   return res.status(400).json({message:"note title already exist"})
 }
 
 //create object
 note.user = user
 note.title = title
 note.text = text
 note.completed = completed
 
 
 const updatedNote = await note.save()
 
 if(updatedNote){
   console.log(updatedNote)
   return res.status(200).json({message:"updated successfully"})
 }else{
   return res.status(400).json({message:"invalid note"})
 }
 
}

//deleteNote
const deleteNote = async(req,res)=>{
  const {id} = req.body
  console.log(id)
  //confirm
  if(!id){
    return res.status(400).json({message:"note id required"})
  }
  
  //note exist
  const note = await noteModel.findById(id).lean().exec()
  if(!note){
    return res.status(400).json({message:"note not found"})
  }
  
//delete
const result = await noteModel.findByIdAndDelete({_id:id})

console.log(result)
    const reply = `note ${result.title} with ID ${result._id} deleted`

    res.json({message: reply})
  
}



module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote
}