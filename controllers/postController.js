const PostModel = require("../models/postModel");
const CategoryModel = require("../models/categoryModel");
const PostTransformer = require("../transformers/postTransformer");
const moment = require("moment");
const Algolia = require("../services/algolia");
const Netlify = require("../services/netlify");
const slugify = require("slugify");

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
			let slug = slugify(name, "-");
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
				isActive: false,
			});
			const post = await PostModel.findOne({ slug: newPost.slug });
			const postTransform = PostTransformer.detail(post);

			await CategoryModel.updateMany(
				{ _id: _categories },
				{ $addToSet: { _posts: { $each: [postTransform.id] } } }
			);
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
			if (!post)
				throw {
					name: "NotFound",
					message: "Post not found",
					code: 404,
				};
			const postTransform = PostTransformer.detail(post);
			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};

	static update = async (req, res, next) => {
		try {
			const { id } = req.params;
			const {
				name,
				description,
				tags,
				categories,
				isMarkdown,
				excerpt,
			} = req.body;
			const _categories = categories.map((category) => category.id);
			let slug = slugify(name, "-");
			const checkPost = await PostModel.findOne({ slug });
			if (checkPost) slug = slug + "-" + moment().format("YYYYMMDDHHss");
			const post = await PostModel.update(
				{ _id: id },
				{ name, slug, description, tags, _categories, isMarkdown, excerpt }
			);
			if (!post)
				throw {
					name: "NotFound",
					message: "Post not found",
					code: 404,
				};
			const postTransform = PostTransformer.detail(post);

			await CategoryModel.updateMany(
				{ _id: _categories },
				{ $addToSet: { _posts: { $each: [postTransform.id] } } }
			);

			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};

	static updateStatus = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { isActive } = req.body;
			const post = await PostModel.update({ _id: id }, { isActive });
			if (!post)
				throw {
					name: "NotFound",
					message: "Post not found",
					code: 404,
				};
			const postTransform = PostTransformer.list(post);

			if (isActive) {
				await Algolia.add("posts", {
					...postTransform,
					objectID: postTransform.id,
				});
			} else {
				await Algolia.remove("posts", postTransform.id);
			}
			
			await Netlify.buildHook();

			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};

	static delete = async (req, res, next) => {
		try {
			const { id } = req.params;
			const post = await PostModel.update({ _id: id }, { isDeleted: true });
			if (!post)
				throw {
					name: "NotFound",
					message: "Post not found",
					code: 404,
				};

			const postTransform = PostTransformer.list(post);

			if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY)
				await Algolia.remove("posts", postTransform.id);

			res.status(200).json(postTransform);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = PostController;
