const express=require('express');
const {AddStudent,GetStudent,GetStudentOne,GetStudentByReg,UpdateStudentOne,DeleteStudent}=require('../Controller/StudentController');
const {AddCourse,GetCourseOne,GetCourse,UpdateCourseOne,DeleteCourse}=require('../Controller/CourseController');
const { AddInstallment, GetInstallment, GetInstallmentOne, UpdateInstallmentOne, DeleteInstallment,SearchByReg, PdfPrint }=require('../Controller/InstallmentController');
const {AddInstructor,GetInstructor,GetInstructorOne,UpdateInstructorOne,DeleteInstructor}=require('../Controller/InstructorController');
const validate= require('../Middleware/AllValidation/AllValidation');
const {validateStudent}=require('../Models/Students/StudentModel');
const {validateCourse}=require('../Models/Course/CourseModel');
const {validateInstallment}=require('../Models/Installments/InstallmentModel');
const {validateInstructor}=require('../Models//Instructor/InstructorModel');

const router = express.Router();

// Students Routes
router.post('/api/add-student',[validate(validateStudent)],AddStudent);
router.get('/api/get-all-student',GetStudent);
router.get('/api/get-student/:id',GetStudentOne);
router.get('/api/get-student-by-reg/:id',GetStudentByReg);
router.patch('/api/update-student/:id',[validate(validateStudent)],UpdateStudentOne);
router.delete('/api/delete-student/:id',DeleteStudent);

// Course Routes
router.post('/api/add-course',[validate(validateCourse)],AddCourse);
router.get('/api/get-all-course',GetCourse);
router.get('/api/get-course/:id',GetCourseOne);
router.patch('/api/update-course/:id',[validate(validateCourse)],UpdateCourseOne);
router.delete('/api/delete-course/:id',DeleteCourse);

// Installment Routes
router.post('/api/add-installment',[validate(validateInstallment)],AddInstallment);
router.get('/api/get-all-installment',GetInstallment);
router.get('/api/get-installment/:id',GetInstallmentOne);
router.patch('/api/update-installment/:id',[validate(validateInstallment)],UpdateInstallmentOne);
router.delete('/api/delete-installment/:id',DeleteInstallment);
router.post('/api/search-by-reg',SearchByReg);
router.post('/api/pdf-print',PdfPrint);

// Instructor Routes
router.post('/api/add-instructor',[validate(validateInstructor)],AddInstructor);
router.get('/api/get-all-instructor',GetInstructor);
router.get('/api/get-instructor/:id',GetInstructorOne);
router.patch('/api/update-instructor/:id',[validate(validateInstructor)],UpdateInstructorOne);
router.delete('/api/delete-instructor/:id',DeleteInstructor);

module.exports=router;