const mongoose = require("mongoose");
const Joi = require('joi');

const CourseSchema = mongoose.Schema({
  course_name:String,
  course_category:String,
  course_duration:Number,
  course_fees:Number,
  course_details:String,
  creation_date: { type: Date, default: Date.now }
});
const CourseModel=mongoose.model('Courses',CourseSchema);

const validateCourse = (course) => {
  const schema = Joi.object({
    course_name: Joi.string().required(),
    course_category:Joi.string().required(),
    course_duration:Joi.number().required(),
    course_fees:Joi.number().required(),
    course_details:Joi.string().allow(''),
  })
  return schema.validate(course)
}
module.exports = {
  CourseModel,
  validateCourse
}