const { model, Schema } = require("mongoose");

// content hoga and kis user ne is wale blog ke liye comment dala h
const commentSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		blogId: {
			type: Schema.Types.ObjectId,
			ref: "blog",
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true }
);

const Comment = model("comment", commentSchema);

module.exports = Comment;
