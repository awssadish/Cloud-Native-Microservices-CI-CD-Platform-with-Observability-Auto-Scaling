import express from "express";

import { generateArticle, generateBlogTitles, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controllers/aicontroller.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../configs/multer.js";

const aiRoutes=express.Router();

aiRoutes.post('/generate-article',auth,generateArticle)
aiRoutes.post('/generate-blog-title',auth,generateBlogTitles)
aiRoutes.post('/generate-image',auth,generateImage)
aiRoutes.post('/remove-image-background', upload.single('image'),auth,removeImageBackground)
aiRoutes.post('/remove-image-object', upload.single('image'),auth,removeImageObject)
aiRoutes.post('/resume-review',upload.single('resume'),auth,resumeReview)

export default aiRoutes

