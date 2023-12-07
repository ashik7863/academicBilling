const {StudentModel} = require("../Models/Students/StudentModel");
const{containsNumber,checkMobile}=require('../Services/sharedFunction');
const { CourseModel } = require("../Models/Course/CourseModel");

const AddStudent = async (req, res) => {
  try {
    const {first_name,last_name,mobile_no,course,installment_breakup} = new StudentModel(req.body);
    const duplicateCheck=await StudentModel.find({first_name:first_name,mobile_no:mobile_no});
    if(containsNumber(first_name) && containsNumber(last_name)){
      return res.json({
        status: 500,
        msg: "Invalid student name.",
      });
    }else if(!checkMobile(mobile_no)){
      return res.json({
        status: 500,
        msg: "Invalid mobile no.",
      });
    }else if(duplicateCheck.length===0){
      const admissionFees=12000;
      const course_fees=await CourseModel.findOne({course_name:course});
console.log(course_fees);

      const pay_per_month=(course_fees.course_fees-admissionFees)/installment_breakup;
      const studentData = new StudentModel({
        ...req.body,
        pay_per_month,
      });

      const resp = await studentData.save();
      return res.json({
        status: 200,
        msg: "Student submitted successfully",
        resp,
    });
    }else{
      return res.json({
        status: 500,
        msg: "Duplicate student details found",
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetStudent = async (req, res) => {
  try {
    const data = await StudentModel.find();
    return res.json({
      status: 200,
      msg: "Student fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetStudentByReg = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StudentModel.find({reg_no:id});
    if (data.length === 0) {
      return res.status(404).json({
        msg: "Student details not found",
      });
    }
    return res.status(200).json({
      msg: "Student fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetStudentOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StudentModel.findOne({ _id: id });
    return res.json({
      status: 200,
      msg: "Student fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateStudentOne = async (req, res) => {
  const { id } = req.params;
  const updateFields = { ...req.body };

  try {
    const student = await StudentModel.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true });
    if (!student) return res.status(404).json({ status: 404, msg: 'Student not found' });
    return res.json({ status: 200, msg: 'Student updated successfully', data: student });
  } catch (error) {
    return res.status(500).json({ status: 500, msg: 'An error occurred while updating data' });
  }
};
const DeleteStudent=async(req,res)=>{
  const { id } = req.params;
  try{
    const student = await StudentModel.findOneAndDelete({ _id: id });
    return res.json({ status: 200, msg: 'Student deleted successfully', data: student });
  }catch(error){
    return res.status(500).json({ status: 500, msg: 'An error occurred while updating data' });
  }
}

module.exports = { AddStudent, GetStudent, GetStudentOne,GetStudentByReg,UpdateStudentOne,DeleteStudent };
