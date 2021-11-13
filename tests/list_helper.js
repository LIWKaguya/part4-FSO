const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) {
        return 0
    } 
    const likes = blogs.map(blog => blog.likes)
    const sumLikes = likes.reduce((first, second) => {
        return first+second
    })
    return sumLikes 
}

module.exports = {
    dummy,
    totalLikes
}