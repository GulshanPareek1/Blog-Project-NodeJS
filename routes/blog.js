const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const {
	checkForAuthenticationCookie,
} = require("../middlewares/authentication");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//console.log(req.user._id);
		const folderPath = path.resolve(`./public/uploads`);
		// cb(null, path.resolve(`./public/uploads/${req.user._id}`));
		cb(null, folderPath);
	},
	filename: function (req, file, cb) {
		const fileName = `${Date.now()}-${file.originalname}`;
		cb(null, fileName);
	},
});
// create an instance for multer
const upload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
	// we're providing user bcz navbar will be present in this page also so givr the values of user
	return res.render("addBlog", {
		user: req.user,
	});
});

router.post("/", upload.single("coverImage"), async (req, res) => {
	const { title, body } = req.body;
	console.log("body id", req.body._id);
	console.log("user.id", req.user._id);
	const blog = await Blog.create({
		title,
		body,
		createdBy: req.user.id,
		coverImageURL: `/uploads/${req.file.filename}`,
	});

	return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		// const blog = await Blog.find({ _id: id });  this basically returns array of values
		const blog = await Blog.findById(id).populate("createdBy"); // only returns one object
		const comments = await Comment.find({ blogId: id }).populate("createdBy");
		console.log("Comments", comments);
		if (!blog) {
			return res.status(404).send("blog not found!!");
		}
		return res.render("showBlog", {
			user: req.user,
			blog,
			comments,
		});
	} catch (error) {
		return res.status(500).send("Internal Server Error: " + error.message);
	}
});

router.post("/comment/:blogId", async (req, res) => {
	await Comment.create({
		content: req.body.content,
		blogId: req.params.blogId,
		createdBy: req.user.id,
	});

	return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
