import { validationResult, matchedData } from "express-validator";

import { DraftModel } from "../models/Draft.model.js";
import { PublishedBlogModel } from "../models/Published.model.js";
import { UserModel } from "../models/User.model.js";

import mongoose from "mongoose";

export const DraftController = (
	draftModel = DraftModel,
	publishedBlogModel = PublishedBlogModel,
	userModel = UserModel
) => {
	const saveDraft = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(409)
					.json({ validationErrors: validationErrors.mapped() });
			}

			const draftId = req.body.draftId;
			const data = matchedData(req);

			const result = await draftModel.updateOne(
				{ user_id: user._id, _id: draftId },
				{
					title: data.title,
					content: data.content,
					updated_at: Date.now(),
				}
			);

			return res
				.status(200)
				.json({ success: true, message: "Draft saved" });
		} catch (error) {
			console.error("Error from saveDraft\n\n", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const getTitlesAndKeys = async (req, res, user) => {
		try {
			let drafts = await draftModel
				.find({ user_id: user._id })
				.select({ _id: 1, title: 1 });

			if (drafts.length === 0) {
				let draft = new draftModel({
					user_id: user._id,
				});
				const result = await draft.save();

				drafts = await draftModel
					.find({ user_id: user._id })
					.select({ _id: 1, title: 1 });
			}

			const publishedBlogs = await publishedBlogModel.find({
				user_id: user._id,
			});

			return res.status(200).json({ drafts, publishedBlogs });
		} catch (error) {
			console.error("Error in getTitlesAndKeys:\n\n", error);
		}
	};

	const getDraft = async (req, res, user) => {
		try {
			const draftId = req.params.draftId;
			const draft = await draftModel.findOne({
				user_id: user._id,
				_id: draftId,
			});
			return res.status(200).json(draft);
		} catch (error) {
			console.error("Error in getDraft:\n\n", error);
		}
	};

	const getPublishedBlogs = async (req, res, user) => {
		try {
			const blogId = req.params.blogId;
			const publishedBlog = await publishedBlogModel.findOne({
				user_id: user._id,
				_id: blogId,
			});
			return res.status(200).json(publishedBlog);
		} catch (error) {
			console.error("Error in getDraft:\n\n", error);
		}
	};

	const updatePublished = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(409)
					.json({ validationErrors: validationErrors.mapped() });
			}

			const blogId = req.body.blogId;
			const data = matchedData(req);

			const result = await publishedBlogModel.updateOne(
				{ user_id: user._id, _id: blogId },
				{
					title: data.title,
					content: data.content,
					updated_at: Date.now(),
				}
			);

			return res
				.status(200)
				.json({ success: true, message: "Blog updated" });
		} catch (error) {
			console.error(error);
		}
	};

	const publishDraft = async (req, res, user) => {
		
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(409)
					.json({ success: false, validationErrors: validationErrors.mapped() });
			}
            const draftId = req.body.draftId;
			const data = matchedData(req);

            const result = await draftModel.findOneAndDelete({user_id: user._id, _id: draftId});
            if(!result){
                return res.status(404).json({success: false, message: "Draft Not Found"});
            }

			const publishBlog = new publishedBlogModel({
				title: data.title,
				content: data.content,
				user_id: user._id,
				created_at: Date.now(),
				updated_at: Date.now(),
			});
			await publishBlog.save();
			return res
				.status(200)
				.json({ success: true, message: "Draft Published", blogId: publishBlog._id });
		} catch (error) {
			console.error(error);
		    return res.status(500).json({ success: false, message: "Internal Server Error" });
		}
		// const demoContent =
		// 	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut libero urna. Morbi in purus bibendum, posuere libero nec, vehicula libero. Curabitur hendrerit risus eget lectus tempus, id facilisis orci sollicitudin. Curabitur condimentum metus vitae urna ultrices dictum. Integer et nisl at ex suscipit varius. Aliquam erat volutpat. Vestibulum in mauris sed ligula volutpat accumsan.\nVestibulum ut sapien vitae nisi volutpat consectetur. Vivamus nec lacus sapien. Etiam vitae vestibulum elit. Proin ut lacus vel augue congue elementum. Sed ut nulla a odio ultrices vulputate. Duis volutpat, sapien in sollicitudin bibendum, libero elit posuere neque, vel pellentesque tellus augue a libero. Phasellus rhoncus ante et nulla cursus, ut viverra nisl tristique. Sed non purus et tortor cursus efficitur.\nSed vel risus a velit vulputate commodo. Aliquam erat volutpat. Vestibulum non quam eu eros scelerisque ullamcorper a non arcu. Vestibulum lobortis auctor quam, in finibus elit laoreet nec. In hac habitasse platea dictumst. Nulla ut libero ut felis cursus tempus. Integer at dui in quam convallis cursus. Sed in metus a quam laoreet vestibulum. Pellentesque hendrerit, ex non malesuada venenatis, massa lacus pulvinar libero, vel facilisis nisi purus vitae quam. Nam congue augue sed sapien congue lacinia. Sed sagittis auctor lectus id varius.\nPhasellus scelerisque sem nec orci condimentum aliquet. Integer bibendum id sapien ut malesuada. Ut dapibus purus ut lacinia iaculis. Ut id dui vitae nisl accumsan pellentesque. Aenean euismod, ipsum id venenatis semper, odio justo iaculis mi, vitae tincidunt urna tellus a dui. Vestibulum a justo ac odio convallis efficitur eu in neque. Aliquam volutpat ex vitae posuere facilisis. Duis aliquet sagittis vulputate. Sed tincidunt diam et neque pharetra, vel consequat nulla convallis. Integer ac metus vel sem scelerisque tincidunt vel vitae eros. Vestibulum iaculis, elit eu lacinia efficitur, ligula ex suscipit nibh, eu dignissim quam urna nec tellus. Nam varius tempor mauris, a finibus risus vestibulum non.\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ac arcu ut mauris tincidunt congue. Nam ullamcorper ultrices arcu, at eleifend velit luctus non. Sed semper, purus vel venenatis tincidunt, metus arcu vulputate lectus, a fringilla quam urna non ante. Integer nec accumsan ex, at elementum justo. Quisque eu elit in libero sagittis tincidunt. Donec vulputate bibendum ligula, non dapibus metus dignissim ut. Vestibulum vehicula bibendum odio, id cursus ex tincidunt non. Ut finibus metus id libero pulvinar, vel ultrices dui egestas. Ut semper, mi a convallis posuere, tortor sapien tristique arcu, eu commodo sem dui sit amet ipsum. Fusce convallis, quam et tempor venenatis, nibh ex feugiat ex, a tincidunt mi felis nec arcu.\nMaecenas eu nulla non arcu rhoncus cursus. Curabitur ut quam in massa bibendum efficitur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ut metus a quam sagittis iaculis nec in sem. Nunc eu nibh vel urna vestibulum convallis. Nam vel lacus vitae purus pharetra malesuada. Aenean tincidunt metus vel odio facilisis laoreet. Duis vel odio sed est venenatis scelerisque. Nam posuere tortor a dui sagittis, eu scelerisque sapien lobortis. Duis vulputate mi non tincidunt tristique. Sed sed nisl vitae velit pharetra sollicitudin et eu lectus. Nullam venenatis tincidunt venenatis. Nulla eu velit sem. Sed eu sagittis sem. Integer at sapien orci. Suspendisse eu semper odio, et efficitur turpis. Vivamus sollicitudin augue a venenatis fermentum.";
		// try {
		// 	let testBlog = [];
		// 	for (let i = 0; i < 50; i++) {
		// 		const blog = {
		// 			title: `Hello world this is the Test Blog ${i + 1}. And I hope it long`,
		// 			content: demoContent,
		// 			// user_id: mongoose.Types.ObjectId(user._id),
		// 		};
		// 		testBlog.push(blog);
		// 	}
		// 	for (const blog of testBlog) {
		// 		const publishBlog = new publishedBlogModel({
		// 			title: blog.title,
		// 			content: blog.content,
		// 			user_id: user._id,
		// 			created_at: Date.now(),
		// 			updated_at: Date.now(),
		// 		});
		// 		await publishBlog.save();
		// 	}
		// 	return res
		// 		.status(200)
		// 		.json({ success: true, message: "Blogs Added" });
		// } catch (error) {
		// 	console.error(error);
		// }
	};

	const getPublishedBlogPosts = async (req, res) => {
		const { page = 1, limit = 10 } = req.query;
		try {
			const publishedBlogs = await publishedBlogModel
				.find()
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();

			const count = await publishedBlogModel.countDocuments();

			return res.status(200).json({
				publishedBlogs,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
			});
		} catch (error) {
			console.error("Error in getPublishedBlogPosts:\n\n", error);
		}
	};

	const geTotalPublishedBlogs = async (req, res) => {
		try {
			const totalPosts = await publishedBlogModel.find({}).count();
			return res.status(200).json({ totalPosts });
		} catch (error) {
			console.error(
				"Error in getPublishedBlogsCollectionSize:\n\n",
				error
			);
		}
	};

	const getSinglePublishedBlog = async (req, res) => {
		try {
			const blogId = req.params.blogId;
			let blog = await publishedBlogModel.findOne({
				_id: blogId,
			});
			const authorName = await userModel
				.findOne({ _id: blog.user_id })
				.select({ username: 1 });
			blog = { ...blog._doc, authorName: authorName.username };
			console.log(blog);
			return res.status(200).json({ blog });
		} catch (error) {
			console.error("Error in getDraft:\n\n", error);
		}
	};

	const deleteDraft = async (req, res, user) => {
		try {
			const draftId = req.body.draftId;
			const result = await draftModel.findOneAndDelete({
				user_id: user._id,
				_id: draftId,
			});
			if (!result) {
				return res
					.status(404)
					.json({ success: false, message: "Draft Not Found" });
			}
			return res
				.status(200)
				.json({ success: true, message: "Draft Deleted" });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	return {
		getTitlesAndKeys,
		saveDraft,
		getDraft,
		getPublishedBlogs,
		updatePublished,
		publishDraft,
		getPublishedBlogPosts,
		geTotalPublishedBlogs,
		getSinglePublishedBlog,
		deleteDraft,
	};
};
