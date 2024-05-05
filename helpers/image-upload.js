const multer = require('multer')
const path = require('path')

// Destionation to store the images
const imageStore = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = ''
        
        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('capys')) {
            folder = 'capys'
        }

        cb(null, `public/images/${folder}/`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
        //String(Math.floor(Math.random() * 1000)) +
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Por favor, envie apenas arquivos jpg ou png!'))
        }
        cb(undefined, true)    
    }
})

module.exports = { imageUpload }