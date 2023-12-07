const mongoose = require("mongoose");
const Joi = require('joi');

const InstructorSchema = mongoose.Schema({
  instructor_name:String,
  instructor_phone:Number,
  instructor_email:String,
  instructor_address:String,
  instructor_courses:String,
  creation_date: { type: Date, default: Date.now }
});
const InstructorModel=mongoose.model('Instructor',InstructorSchema);

const validateInstructor = (instructor) => {
  const schema = Joi.object({
    instructor_name: Joi.string().required(),
    instructor_phone:Joi.number().required(),
    instructor_email:Joi.string().email().required(),
    instructor_address:Joi.string().allow(''),
    instructor_courses:Joi.string().required(),
  })
  return schema.validate(instructor)
}
module.exports = {
    InstructorModel,
    validateInstructor
}