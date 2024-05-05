const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {
    static async register(req, res) {
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        // Validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }
        if (!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }
        if (!phone) {
            res.status(422).json({message: 'O telefone é obrigatório!'})
            return
        }
        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }
        if (!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatória!'})
            return
        }

        // Matching password and confirmpassword
        if (password !== confirmpassword) {
            res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais!'})
            return
        }

        // Check if user exists
        const userExists = await User.findOne({email: email})

        if (userExists) {
            res.status(422).json({message: 'E-mail em uso! Por favor, utilize outro email.'})
            return
        }

        // Create a hashed password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create a User
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {
        const email = req.body.email
        const password = req.body.password

        if (!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }
        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }

        // Check if user exists
        const user = await User.findOne({email: email})

        if (!user) {
            res.status(422).json({message: 'Não há usuário cadastrado com este e-mail!'})
            return
        }

        // Check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({message: 'Senha inválida!'})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }
    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if (!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json({ user })
    }
    static async editUser(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        if (req.file) {
            const imageName = req.file.filename
            user.image = imageName
        }

        //Validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }
        user.name = name

        if (!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }
        // Check if email has already taken
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({message: 'Por favor, utilize outro e-mail!'})
            return
        }
        user.email = email

        //if (image) {
            //const imageName = req.file.filename
            //user.image = imageName
        //}

        if (!phone) {
            res.status(422).json({message: 'O telefone é obrigatório!'})
            return
        }
        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({message: 'As senhas não conferem!'})
            return
        } else if (password === confirmpassword && password != null) {
            // Creating password
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password

            const passwordHash = await bcrypt.hash(reqPassword, salt)

            user.password = passwordHash
        }
        try {
            // returns user updated data
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true },
            )
            res.status(200).json({message: 'Usuário atualizado com sucesso!', data: updatedUser})
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}