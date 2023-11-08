import express from "express";
import { getAllUsers, login, signup, wingCallback  } from "../controllers/user-controller";
import { addBlog, getAllBlogs } from "../controllers/blog-controller";
import { authorization, test } from "../controllers/onlinepayment-controller-v1";

const router = express.Router();

// User route
router.get("/users", getAllUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/", (req, res) => {
    res.send("Hello World!");
})

// Blog route
router.get("/blogs", getAllBlogs);
router.post("/add/blog", addBlog);

// Payment route
router.post("/api/callback", wingCallback);

router.get("/testing", test);

// Online Payment route
router.post('/v1/onlinepayment/authorization', authorization);

export default router;