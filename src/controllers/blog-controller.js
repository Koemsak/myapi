import Blog from "../models/Blog";

export const getAllBlogs = async (req, res) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (error) {
        console.log(error);
    }
    if (!blogs || !blogs.length) {
        return res.status(404).json({ status: 404, message: "Blog doesn't exist", data: null });
    }
    return res.status(200).json({ status: 200, message: "Successfully", data: blogs });
}

export const addBlog = async (req, res) => {
    const { title, content, image, user } = req.body;
    const blog = new Blog({
        title,
        content,
        image,
        user
    });

    try {
        await blog.save();
        return res.status(201).json({ status: 201, message: "Successfully", data: blog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: null });
    }
}