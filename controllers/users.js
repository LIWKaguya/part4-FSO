const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) =>{
    const users = await User.find({})
    .populate('blogs', {title:1, author:1, url:1, likes:1})
    response.status(200).json(users.map(user => user.toJSON()))
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    if(user) {
        response.status(200).json(user.toJSON())
    } else {
        response.status(404).end()
    }
})

usersRouter.post('/', async (request, response) => {
    const {body} = request
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(200).json(savedUser)
})

module.exports = usersRouter