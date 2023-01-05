const express = require("express")
const router = express.Router()

const {createUser,login, getUser, updateUser, deleteUser} = require('../controllers/userController')
const {authontication,authorise} = require('../middlewares/auth')

router.post('/signUp',createUser)
router.post('/login',login)
router.get('/getUser/:userId',authontication,getUser)
router.put('/updateUser/:userId',authontication, authorise, updateUser)
router.delete('/deleteUser/:userId',authontication, authorise, deleteUser)
router.all("/*", (req,res) => {return res.status(400).send({status: false , msg : "Endpoint is not valid"})})

module.exports = router