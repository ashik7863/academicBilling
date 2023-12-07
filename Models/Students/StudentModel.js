const mongoose = require("mongoose");
const Joi = require('joi');

const StudentSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  registration_date: { type: Date, default: Date.now },
  reg_no: String,
  course: String,
  installment_breakup:Number,
  pay_per_month:Number,
  gender: String,
  mobile_no: Number,
  guardian_name: String,
  guardian_mobile_no: Number,
  date_of_birth: Date,
  fees_type:String,
  blood_group: String,
  address: String,
});
const StudentModel=mongoose.model('Students',StudentSchema);

const validateStudent = (student) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(15).trim().strict().required(),
    last_name: Joi.string().min(3).max(15).trim().strict().required(),
    email: Joi.string().email().required(),
    reg_no: Joi.string().required(),
    course: Joi.string().required(),
    installment_breakup:Joi.number().required(),
    pay_per_month:Joi.number(),
    gender: Joi.string().required(),
    mobile_no: Joi.number().required(),
    guardian_name: Joi.string().min(3).max(25).required(),
    guardian_mobile_no: Joi.number().required(),
    date_of_birth: Joi.date().required(),
    fees_type:Joi.required(),
    blood_group: Joi.string().min(2).max(4).allow(''),
    address: Joi.string().allow(""),
  })
  return schema.validate(student)
}
module.exports = {
  StudentModel,
  validateStudent
}