const express = require("express")
const verifyJwt = require("../Middleware/verifyJwt")

const router = express.Router()

router.use(verifyJwt)

const {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote
} = require("../controllers/noteController")

router.route("/")
.get(getAllNotes)
.post(createNewNote)
.patch(updateNote)
.delete(deleteNote)


module.exports = router