const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
	checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog");
const app = express();
const PORT = 8000;

mongoose
	.connect("mongodb://localhost:27017/blogify")
	.then((e) => console.log("mongodb connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
// for using static files inside our app (for interaction)
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
	const allBlogs = await Blog.find({}).sort({ createdAt: -1 }); // descending order sort
	res.render("home", {
		user: req.user,
		blogs: allBlogs,
	});
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server Started on PORT: ${PORT}`));
