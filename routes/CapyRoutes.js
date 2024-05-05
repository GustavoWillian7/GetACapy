const router = require('express').Router()

const CapyController = require('../controllers/CapyController')

// Middlewares
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), CapyController.create)
router.get('/', CapyController.getAll)
router.get('/mycapys', verifyToken, CapyController.getAllUserCapys)
router.get('/myadoptions', verifyToken, CapyController.getAllUserAdoptions)
router.get('/:id', CapyController.getCapyById)
router.delete('/:id', verifyToken, CapyController.removeCapyById)
router.patch('/:id', verifyToken, imageUpload.array('images'), CapyController.updateCapy)
router.patch('/schedule/:id', verifyToken, CapyController.schedule)
router.patch('/conclude/:id', verifyToken, CapyController.concludeAdoption)

module.exports = router