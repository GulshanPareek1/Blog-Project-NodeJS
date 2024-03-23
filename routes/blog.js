const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");

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
const upload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
	// we're providing user bcz navbar will be present in this page also so givr the values of user
	return res.render("addBlog", {
		user: req.user,
	});
});

router.post("/", upload.single("coverImage"), async (req, res) => {
	const { title, body } = req.body;
	const blog = await Blog.create({
		title,
		body,
		createdBy: req.user._id,
		coverImageURL: `/uploads/${req.file.filename}`,
	});

	return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;