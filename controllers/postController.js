const PostModel = require("../models/postModel");
const PostTransformer = require("../transformers/postTransformer");
const moment = require("moment");

class PostController {
	static create = async (req, res, next) => {
		try {
			const {
				name,
				description,
				tags,
				categories,
				isMarkdown,
				excerpt,
			} = req.body;
			const _categories = categories.map((category) => category.id);
			let slug = name.replace(" ", "-");
			const checkPost = await PostModel.findOne({ slug });
			if (checkPost) slug = slug + "-" + moment().format("YYYYMMDDHHss");
			const newPost = await PostModel.create({
				name,
				slug,
				excerpt,
				description,
				tags,
				isMarkdown,
				_categories,
				isActive: true,
			});
			const post = await PostModel.findOne({ slug: newPost.slug });
			const postTransform = PostTransformer.list(post);
			res.status(201).json(postTransform);
		} catch (error) {
			next(error);
		}
	};

	static findAll = async (req, res, next) => {
		try {
			const condition = {};
			const posts = await PostModel.findAll(condition);
			const postsTransform = PostTransformer.list(posts);
			res.status(200).json(postsTransform);
		} catch (error) {
			next(error);
		}
	};

	static findOne = async (req, res, next) => {
		try {
			const { id } = req.params;
			const post = await PostModel.findOne({ _id: id });
			const postTransform = PostTransformer.detail(post);
			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};

	static update = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name } = req.body;
			const post = await PostModel.update(id, { name });
			const categoryTransform = PostTransformer.list(post);
			res.status(200).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};

	static updateStatus = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { isActive } = req.body;
			const post = await PostModel.update(id, { isActive });
			const postTransform = PostTransformer.list(post);
			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};

	static delete = async (req, res, next) => {
		try {
			const { id } = req.query;
			const post = await PostModel.update(id, { isDeleted: true });
			const postTransform = PostTransformer.list(post);
			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = PostController;
