import { populate } from "dotenv";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "courseTitle and category are required.",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      course,
      message: "Course created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Course.",
    });
  }
};
export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;
    //search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    ////if categories are selected
    if(categories.lenght>0){
      searchCriteria.category={$in:categories};
    }
    //define sorting order
    const sortOptions={};
    if(sortByPrice==="low"){
      sortOptions.coursePrice=-1;//sort by price in ascending order
    }
    else if(sortByPrice==="high"){
      sortOptions.coursePrice=1;//decending
    }
    let courses=await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions)
    return res.status(200).json({
      success:true,
      courses:courses || []
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Search Course.",
    });
  }
};
export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    console.log(courses);
    if (!courses) {
      return res.status(404).json({
        message: "Course noy found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log("error while getting published course", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published Courses.",
    });
  }
};

export const getCreaterCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found.",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Course.",
    });
  }
};
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    console.log(category);
    const thumbnail = req.file;
    let course = await Course.findById(courseId);
    console.log(course.courseTitle);
    console.log(thumbnail);
    console.log(course);
    if (!course) {
      return res.status(404).json({
        message: "Course not found..",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      course,
      message: "Course updated Successfully",
    });
  } catch (error) {
    console.error("error occured while updating.", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        message: "Course not found",
        status: false,
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.error("error occured while updating.", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course by Id.",
    });
  }
};
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    console.log(req.body);
    const courseId = req.params.courseId;
    console.log(courseId);
    console.log(lectureTitle);
    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture Title and courseid is not present.",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      lecture,
      message: "Lecture created successfully..",
    });
  } catch (error) {
    console.log("error while creating course", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture.",
    });
  }
};
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
        success: false,
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log("error while getting the course", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture.",
    });
  }
};
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }
    //updatte lecture
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    if (videoInfo?.videoUrl) {
      lecture.videoUrl = videoInfo.videoUrl;
    }
    if (videoInfo?.publicId) {
      lecture.publicId = videoInfo.publicId;
    }
    console.log(isPreviewFree);
    console.log(isPreviewFree);
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();
    //Ensure the course still has lecture id if it was not already added
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    console.log("error while editing the lecture", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture.",
    });
  }
};
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    //delete the lecture from cloudinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    //Remove the lecture from course also
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );
    return res.status(200).json({
      message: "Lecture Deleted Successfully.",
    });
  } catch (error) {
    console.log("error while editing the lecture", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture.",
    });
  }
};
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log("error while editing the lecture", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture.",
    });
  }
};
//publish unpublish course logic
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.log("Error ocuured while updating course", error);
    return res.status(500).json({
      message: "Failed to Update Status",
      success: false,
    });
  }
};
