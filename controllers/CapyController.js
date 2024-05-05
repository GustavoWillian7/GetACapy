const Capy = require('../models/Capy')

// Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class CapyController {
    // Create a capy
    static async create(req, res) {
        const {name, age, weight} = req.body
        const images = req.files
        const available = true

        // Validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        if (!age) {
            res.status(422).json({message: 'A idade é obrigatória!'})
            return
        }

        if (!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return
        }

        if (images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatória!'})
            return
        }

        // Get capy owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // Create a pet
        const capy = new Capy({
            name,
            age,
            weight,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }        
        })
        images.map((image) => {
            capy.images.push(image.filename)
        })
        try {
            const newCapy = await capy.save()
            res.status(201).json({message: 'Capivara cadastrada com sucesso!', newCapy})
        } catch (error) {
            res.status(500).json({message: error})           
        }
    }
    static async getAll(req, res) {
        const capys = await Capy.find().sort('-createdAt')
        res.status(200).json({capys: capys})
    }
    static async getAllUserCapys(req, res) {
        // Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const capys = await Capy.find({'user._id': user._id}).sort('-createdAt')   
        res.status(200).json({capys})
    }
    static async getAllUserAdoptions(req, res) {
        // Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const capys = await Capy.find({'adopter._id': user._id}).sort('-createdAt')   
        res.status(200).json({capys})
    }
    static async getCapyById(req, res) {
        const id = req.params.id

        // Check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        // Check if capy exists
        const capy = await Capy.findOne({_id: id})

        if (!capy)   {
            res.status(404).json({message: 'Capivara não encontrada!'})
        }

        res.status(200).json({capy: capy})
    }
    static async removeCapyById(req, res) {
        const id = req.params.id

        // Check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        // Check if capy exists
        const capy = await Capy.findOne({_id: id})

        if (!capy) {
            res.status(404).json({message: 'Capivara não encontrada!'})
            return
        }  
        
        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (capy.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar sua solicitação, por favor, tente novamente mais tarde!'})
            return
        }

        await Capy.findByIdAndRemove(id)

        res.status(200).json({message: 'Capivara removida com sucesso!'})
    }
    static async updateCapy(req, res) {
        const id = req.params.id
        const {name, age, weight, available} = req.body
        const images = req.files
        const updatedData = {}

        // Check if capy exists
        const capy = await Capy.findOne({_id: id})

        if (!capy) {
            res.status(404).json({message: 'Capivara não encontrada!'})
            return
        }
        
        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (capy.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar sua solicitação, por favor, tente novamente mais tarde!'})
            return
        }

        // Validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        } else {
            updatedData.name = name
        }

        if (!age) {
            res.status(422).json({message: 'A idade é obrigatória!'})
            return
        } else {
            updatedData.age = age
        }

        if (!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return
        } else {
            updatedData.weight = weight
        }

        if (images.length > 0) {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Capy.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Capivara atualizada com sucesso!'})
    }
    static async schedule(req, res) {
        const id = req.params.id

        // Check if capy exists
        const capy = await Capy.findOne({_id: id})

        if (!capy) {
            res.status(404).json({message: 'Capivara não encontrada!'})
            return
        }

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (capy.user._id.equals(user._id)) {
            res.status(422).json({message: 'Você não pode agendar uma visita para sua própria capivara!'})
            return
        }

        // Check if user has already scheduled a visit
        if (capy.adopter) {
            if (capy.adopter._id.equals(user._id)) {
                res.status(422).json({message: 'Você já agendou uma visita para esta capivara!'})
                return
            }
        }

        // Add user to capy
        capy.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Capy.findByIdAndUpdate(id, capy)

        res.status(200).json({message: `Visita agendada com sucesso! Entre em contato com ${capy.user.name} pelo telefone ${capy.user.phone}.`})
    }
    static async concludeAdoption(req, res) {
        const id = req.params.id

        // Check if capy exists
        const capy = await Capy.findOne({_id: id})

        if (!capy) {
            res.status(404).json({message: 'Capivara não encontrada!'})
            return
        }

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (capy.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar sua solicitação, por favor, tente novamente mais tarde!'})
            return
        }

        capy.available = false

        await Capy.findByIdAndUpdate(id, capy)

        res.status(200).json({message: 'Parabéns! O processo de adoção foi um sucesso.'})
    }
}