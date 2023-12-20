const express = require("express")
const verifyJwt = require("../Middleware/verifyJwt")
const userController = require("../controllers/userController")

const router = express.Router()

router.use(verifyJwt)

const {
  getAllUser,
  createUser,
  updateUser,
  deleteUser
} = userController

//end point http://localhost:3000/users
router.route("/")
.get(getAllUser)
.post(createUser)
.patch(updateUser)
.delete(deleteUser)



module.exports = router