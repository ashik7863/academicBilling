const { CourseModel } = require("../Models/Course/CourseModel");

const AddCourse = async (req, res) => {
  try {
    
    const duplicateCheck=await CourseModel.find({course_name:req.body.course_name});
    if(duplicateCheck.length===0){
      const courseData = new CourseModel(req.body);
      const resp = await courseData.save();
      return res.json({
        status: 200,
        msg: "Course submitted successfully",
        resp,
      });
    }
    return res.json({
      status: 500,
      msg: "Course details is already submitted",
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetCourse = async (req, res) => {
  try {
    const data = await CourseModel.find();
    return res.json({
      status: 200,
      msg: "Course fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetCourseOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await CourseModel.findOne({ _id: id });
    return res.json({
      status: 200,
      msg: "Course fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateCourseOne = async (req, res) => {
  console.log('Testing',req.body)
    const { id } = req.params;
    const updateFields = { ...req.body };
    try {
      const course = await CourseModel.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true });
      console.log(course)
      if (!course) return res.status(404).json({ status: 404, msg: 'Course not found' });
      return res.json({ status: 200, msg: 'Course updated successfully', data: course });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 500, msg: 'An error occurred while updating data' });
    }
  };
  const DeleteCourse=async(req,res)=>{
    const { id } = req.params;
    try{
      const course = await CourseModel.findOneAndDelete({ _id: id });
      return res.json({ status: 200, msg: 'Course deleted successfully', data: course });
    }catch(error){
      return res.status(500).json({ status: 500, msg: 'An error occurred while updating data' });
    }
  }

module.exports = { AddCourse, GetCourseOne, GetCourse,UpdateCourseOne,DeleteCourse };
