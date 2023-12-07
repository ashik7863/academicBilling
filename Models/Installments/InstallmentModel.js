const mongoose = require("mongoose");
const Joi = require('joi');

const InstallmentSchema = mongoose.Schema({
  bill_no:String,
  first_name: String,
  last_name: String,
  email:String,
  reg_no: String,
  course_name: String,
  course_fees:Number,
  mobile_no: Number,
  payment_mode: String,
  installment_date:{ type: Date, default: Date.now },
  installment_no:String,
  installment_amount:Number,
  installment_due:Number
});

const InstallmentModel=mongoose.model('Fees',InstallmentSchema);

const validateInstallment = (fees) => {
  const schema = Joi.object({
    bill_no:Joi.string(),
    first_name: Joi.string().min(2).max(15).required(),
    last_name: Joi.string().min(3).max(15).required(),
    email:Joi.string().email(),
    reg_no: Joi.string().required(),
    course_name: Joi.string().required(),
    course_fees:Joi.number(),
    mobile_no: Joi.number().allow(""),
    payment_mode: Joi.string().required(),
    installment_no:Joi.string().required(),
    installment_amount:Joi.number().required(),
  })
  return schema.validate(fees)
}
module.exports = {
  InstallmentModel,
  validateInstallment
}