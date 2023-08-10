import { UserModel } from "../models/User.model.js";
import { DraftModel, PublishedBlogModel } from "../models/Blog.model.js";

export const DraftController = () => {
	const createNewDraft = async (req, res, next) => {
		try {
			const draft = new UserModel();
			const result = await draft.save();
			console.log("draft", draft);
			console.log("result", result);
			// return res.status(200).json()
		} catch (error) {
			console.error(error);
		}
	};

	const getTitlesAndKeys = async (req, res, next) => {
        const {email} = JSON.parse(req.headers.user);
		try {
            const user = await UserModel.findOne({ email });
            const userId = user._id;
            
            let drafts = await DraftModel.find({ user_id: userId });
            
            if (drafts.length === 0) {
                let draft = new DraftModel({
                    user_id: userId,
                });
                await draft.save();
    
                drafts = await DraftModel.find({user_id: userId});
            }
    
            const publishedBlogs = await PublishedBlogModel.find({
                user_id: userId,
            });
            return res.status(200).json({drafts, publishedBlogs});
    
        } catch (error) {
            console.error(error);
        }
	};
	return { getTitlesAndKeys };
};


