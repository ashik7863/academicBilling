const {InstructorModel}=require('../Models/Instructor/InstructorModel');

const AddInstructor = async (req, res) => {
    try {
      const {instructor_name,instructor_phone} = new InstructorModel(req.body);
      const duplicateCheck=await InstructorModel.find({instructor_name:instructor_name,instructor_phone:instructor_phone});
      
      if(instructor_phone.toString().length!==10){
        res.status(500).json({ error: "Invalid mobile number" });
      }else if(duplicateCheck.length===0){
        const instructorData = new InstructorModel(req.body);
        const resp = await instructorData.save();
        return res.json({
          status: 200,
          msg: "Instructor details submitted successfully",
          resp,
      });
      }else{
        return res.json({
          status: 500,
          msg: "duplicate instructor details found",
        });
      }
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const GetInstructor = async (req, res) => {
    try {
      const data = await InstructorModel.find();
      return res.json({
        status: 200,
        msg: "Instructor details fetched successfully",
        data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const GetInstructorOne = async (req, res) => {
    const { id } = req.params;
    try {
      const data = await InstructorModel.findOne({ _id: id });
      return res.json({
        status: 200,
        msg: "Instructor details fetched successfully",
        data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const UpdateInstructorOne = async (req, res) => {
    const { id } = req.params;
    const updateFields = { ...req.body };
  
    try {
      const student = await InstructorModel.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true });
      if (!student) return res.status(404).json({ status: 404, msg: 'Instructor details not found' });
      return res.json({ status: 200, msg: 'Instructor details updated successfully', data: student });
    } catch (error) {
      return res.status(500).json({ status: 500, msg: 'An error occurred while updating data' });
    }
  };
  const DeleteInstructor=async(req,res)=>{
    const { id } = req.params;
    try{
      const student = await InstructorModel.findOneAndDelete({ _id: id });
      return res.json({ status: 200, msg: 'Instructor details deleted successfully', data: student });
    }catch(error){
      return res.status(500).json({ status: 500, msg: 'An error occurred while updating data' });
    }
  }
  module.exports = {AddInstructor,GetInstructor,GetInstructorOne,UpdateInstructorOne,DeleteInstructor};