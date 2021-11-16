const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    .populate('user', {username: 1, name: 1})
    response.status(200).json(blogs.map(blog => blog.toJSON()))
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.status(200).json(blog.toJSON())
    } else {
      response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author || "Anonymous",
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(200).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const {body} = request 
  const blog = {
    title: body.title,
    author: body.author || "Anonymous",
    url: body.url,
    likes: body.likes || 0,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.status(200).json(updatedBlog.toJSON())
})

module.exports = blogsRouter