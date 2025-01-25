import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
const router=express.Router();
router.route("/upload-video").post(upload.single("file"),async(req,res)=>{
    try {
    const result=await uploadMedia(req.file.path) ;
    console.log(result);
    res.status(200).json({
      success:true,
        message:"File uploaded Successfully.",
        data:result,
    }) 
    } catch (error) {
      console.log("Error while uploading the file",error) ;
      return res.status(500).json({
        message:"Error while uploading the File."
      })
    }
})
export default router;