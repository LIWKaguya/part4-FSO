const Blog = require('../models/blog')

const testingBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  
]

const validBlog = {
    title : "Matsuri",
    author: "KuroKousuii",
    url: "www.matsuri.com",
    likes: 213
}

const missingLikesBlog = {
    title : "Roboco",
    author: "KuroKousuii",
    url: "www.roboco.com",
}

const missingTitleBlog = {
    author:"KuroKousuii",
    url:"www.suisei.com",
    likes:69
}

const missingUrlBlog = {
    title:"Sakura Miko",
    author:"KuroKousuii",
    likes:231
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({
        title: "Tokino Sora",
        author: "KuroKousuii",
        url: "www.sora.com",
        likes: 10
    })
    await blog.save()
    await blog.delete()
    
    return blog._id.toString()
}

module.exports = {
    testingBlogs, blogsInDb, nonExistingId,
    validBlog, missingLikesBlog, missingTitleBlog,
    missingUrlBlog
}