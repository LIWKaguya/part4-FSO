const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogs = helper.testingBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('get method returned as json and same length', async () => {
    const response = await api.get('/api/blogs')
    .expect(200).expect('Content-Type', /application\/json/)
    expect(response.body.length).toBe(helper.testingBlogs.length)
})

test('there is id property', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
})

test('post method saved correctly and increase the length', async () => {
    await api.post('/api/blogs').set('Content-Type', 'application/json')
    .send(helper.validBlog).expect(200)
    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs.length).toBe(helper.testingBlogs.length+1)
    const titles = updatedBlogs.map(blog => blog.title)
    expect(titles).toContain('Matsuri')
})

test('likes in default is 0', async () => {
    const response = await api.post('/api/blogs').set('Content-Type', 'application/json')
    .send(helper.missingLikesBlog).expect(200)
    expect(response.body.likes).toBe(0)
})

test('deleting return 204 and not containing the title', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const deletingBlog = blogsAtStart[0]

    await api.delete(`/api/blogs/${deletingBlog.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.testingBlogs.length-1)
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain('React patterns')
})

test('updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updatingBlog = blogsAtStart[0]

    await api.put(`/api/blogs/${updatingBlog.id}`).set('Content-Type', 'application/json')
    .send(helper.updatingBlog).expect(200)
    const blogsAtEnd = await helper.blogsInDb() 
    expect(blogsAtEnd.length).toBe(helper.testingBlogs.length)
    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes).toContain(23189)
})

test('invalid if missing url or title', async () => {
    await api.post('/api/blogs').set('Content-Type', 'application/json')
    .send(helper.missingTitleBlog).expect(400)

    await api.post('/api/blogs').set('Content-Type', 'application/json')
    .send(helper.missingUrlBlog).expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})