const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

const { InstallmentModel } = require("../Models/Installments/InstallmentModel");
const { CourseModel } = require("../Models/Course/CourseModel");
const { StudentModel } = require("../Models/Students/StudentModel");

const {generateOrdinalArray}=require("../Services/sharedFunction")

const AddInstallment = async (req, res) => {
  try {
    const { first_name, mobile_no } = req.body;
    const existingPay = await InstallmentModel.find({
      first_name: first_name,
      mobile_no: mobile_no,
    });
    const installmentData = new InstallmentModel(req.body);

    if (existingPay.length === 0) {
      const { course_name } = req.body;
      const dueAmount = await CourseModel.findOne({ course_name: course_name });

      installmentData.installment_due =
        dueAmount.course_fees - installmentData.installment_amount;
    } else {
      if (
        existingPay[existingPay.length - 1].installment_due -
          installmentData.installment_amount <
        0
      ) {
        return res.json({
          status: 500,
          msg: "Installment amount should be less than or equal to remaining fees",
        });
      } else {
        installmentData.installment_due =
          existingPay[existingPay.length - 1].installment_due -
          installmentData.installment_amount;
      }
    }
    const resp = await installmentData.save();
    await generateInstallmentPDF(installmentData);
    res.json({
      status: 200,
      msg: "Installment submitted successfully",
      resp,
    });
    
    sendInstallmentConfirmationEmail(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const sendInstallmentConfirmationEmail = async (installmentData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ashikmolla78633@gmail.com",
        pass: "sbdu rpmf wgsm qaha",
      },
    });

    const filePath = `bill-template\\pdfs\\${installmentData.bill_no}.pdf`;

const mailOptions = {
  from: "ashikmolla78633@gmail.com",
  to: installmentData.email,
  subject: "Installment Submitted Successfully",
  text: `Dear ${installmentData.first_name},\n\nYour ${installmentData.installment_no} installment of ${installmentData.installment_amount} has been submitted successfully.\n\nThank you.`,
  html:`<div>
  <div class="">
   <div class="aHl"></div>
   <div id=":pt" tabindex="-1"></div>
   <div id=":pg" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd; 4:WyIjbXNnLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd">
      <div id=":pf" class="a3s aiL ">
         <u></u>
         <div style="margin:0">
            <table style="border-collapse:collapse;max-width:600px;width:100%;margin:0 auto;color:#000;font-size:19px;line-height:1.5;background:#ffffff;vertical-align:top;border-bottom:5px solid #012033;font-family:Arial,sans-serif">
               <tbody>
                  <tr>
                     <td width="100%" style="text-align:center;padding:10px 30px;border-bottom:5px solid #00baff"><a style="display:inline-block;text-decoration:none" href="https://www.adretsoftware.in/" target="_blank"><img width="300px" src="https://www.adretsoftware.in/images/logo-dark.webp" alt="Adret Software pvt ltd" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a></td>
                  </tr>
                  <tr>
                     <td style="text-align:center;padding:10px 30px">
                        <h3 style="color:#163560;font-weight:700;font-size:28px;margin:5px 0">Hello! ${installmentData.first_name} ${installmentData.last_name}</h3>
                        <h4 style="color:#3b99d1;font-weight:700;font-size:31px;margin:5px 0">Congratulations!!!</h4>
                        <h5 style="color:#384152;font-weight:700;font-size:16px;margin:10px 0 15px 0">Your ${installmentData.installment_no} installment amount of ${installmentData.installment_amount}.00 has been done on ${new Date().toJSON().slice(0, 10)}.</h5>
                        <h5 style="color:#384152;font-weight:700;font-size:16px;margin:10px 0 15px 0">Bill no. ${installmentData.bill_no}</h5>
                     </td>
                  </tr>
                  <tr>
                     <td style="background-color:#ebf3fa;padding:10px 30px">
                        <table style="border-collapse:collapse;width:100%">
                           <tbody>
                              <tr>
                                 <td style="text-align:center">
                                    <h5 style="color:#2b478b;font-size:17px;font-weight:700;margin-bottom:15px">Below are the installment(s) details </h5>
                                 </td>
                              </tr>
                              <tr>
                                 <td>
                                    <table style="border-collapse:collapse;width:100%">
                                       <tbody>
                                          <tr>
                                             <td style="padding:8px 0;width:45%">
                                                <h4 style="color:#1b3768;font-size:17px;font-weight:700;margin:0">Course name:</h4>
                                             </td>
                                             <td style="text-align:left;padding:8px 0;width:55%">
                                                <p style="color:#1b3768;font-size:17px;font-weight:400;margin:0">${installmentData.course_name}</p>
                                             </td>
                                          </tr>
                                          <tr>
                                             <td style="padding:8px 0;width:45%">
                                                <h4 style="color:#1b3768;font-size:17px;font-weight:700;margin:0">Total course fees: </h4>
                                             </td>
                                             <td style="text-align:left;padding:8px 0;width:55%">
                                                <p style="color:#1b3768;font-size:17px;font-weight:400;margin:0">${installmentData.course_fees}.00  ( With GST )</p>
                                             </td>
                                          </tr>
                                          <tr>
                                             <td style="padding:8px 0;width:45%;vertical-align:top">
                                                <h4 style="color:#1b3768;font-size:17px;font-weight:700;margin:0">Installment amount : </h4>
                                             </td>
                                             <td style="text-align:left;padding:8px 0;width:55%">
                                                <p style="color:#1b3768;font-size:17px;font-weight:400;margin:0"><span style="color:green"> ${installmentData.installment_amount}.00 ( Paid )</span></p>
                                             </td>
                                          </tr>
                                          <tr>
                                             <td style="padding:8px 0;width:45%;vertical-align:top">
                                                <h4 style="color:#1b3768;font-size:17px;font-weight:700;margin:0">Installment type : </h4>
                                             </td>
                                             <td style="text-align:left;padding:8px 0;width:55%">
                                                <p style="color:#1b3768;font-size:17px;font-weight:400;margin:0">${installmentData.installment_no}</p>
                                             </td>
                                          </tr>
                                         
                                       </tbody>
                                    </table>
                                 </td>
                              </tr>
                              <tr>
                                 <td style="text-align:center">
                                    <h5 style="color:#2b478b;font-size:15px;font-weight:700">Fees once paid are not returnable/refundable or transferrable.</h5>
                                    <h5 style="color:#2b478b;font-size:15px;font-weight:700">With the mail you will find one attachments: </h5>
                                    <p style="font-size:15px;color:#657ca4;font-weight:400;max-width:418px;margin:auto;margin-bottom:15px">
                                       The is about the invoice for the payment made by you.  
                                    </p>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td style="text-align:center;padding:0 30px">
                        <h5 style="font-size:17px;color:#163560;font-weight:700;margin-bottom:16px">We hope together we will write a successful story for you! Let’s embark on this journey with great energy and enthusiasm.  </h5>
                     </td>
                  </tr>

               </tbody>
            </table>
            <div class="yj6qo"></div>
            <div class="adL">
            </div>
         </div>
         <div class="adL">
         </div>
      </div>
   </div>
   <div id=":qh" class="ii gt" style="display:none">
      <div id=":qi" class="a3s aiL "></div>
   </div>
   <div id=":pv" class="hq gt">
      <div class="hp"></div>
      <div id=":px" class="ho">
         
         <div class="aZi J-J5-Ji">
            <div id=":ql" class="T-I J-J5-Ji aZj T-I-ax7 L3" role="button" aria-label="Add all to Drive" aria-disabled="false" data-tooltip="Add all to Drive" style="user-select: none;" tabindex="0">
               <div class="asa">
                  <div class="XF T-I-J3 J-J5-Ji">
                     <div class="T-aT4">
                        <div></div>
                        <div class="T-aT4-JX"></div>
                     </div>
                  </div>
               </div>
               <div class="a3I">&nbsp;</div>
            </div>
         </div>
      </div>
      <div id=":q1"></div>
      <div id=":pw" class="aQH">
         <span class="aZo N5jrZb" download_url="application/pdf:Invoice-1685008387.pdf:https://mail.google.com/mail/u/0/https://mail.google.com/mail/u/0?ui=2&amp;ik=5fd6b33736&amp;attid=0.1&amp;permmsgid=msg-f:1766859356714402729&amp;th=18852539450983a9&amp;view=att&amp;disp=safe" draggable="true">
            <a id=":q2" class="aQy aZr e" href="https://mail.google.com/mail/u/0?ui=2&amp;ik=5fd6b33736&amp;attid=0.1&amp;permmsgid=msg-f:1766859356714402729&amp;th=18852539450983a9&amp;view=att&amp;disp=inline" target="_blank" role="link" jslog="119523; u014N:xr6bB,cOuCgd,Kr2w4b; 4:WyIjbXNnLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd; 43:WyJhcHBsaWNhdGlvbi9wZGYiLDc4NjAwXQ.." data-tooltip-align="t,c" data-tooltip-class="a1V" tabindex="0">
           
               <div aria-hidden="true">
                  <div class="aSG"></div>
                  <div class="aVY aZn">
                     <div class="aZm"></div>
                  </div>
                  
                     
                  </div>
                  <div class="aSI">
                     <div id=":q4" class="aSJ" style="border-color: #fb4c2f"></div>
                  </div>
               </div>
            </a>
            <div class="aQw">
               <div id=":qc" class="T-I J-J5-Ji aQv T-I-ax7 L3" role="button" aria-label="Download attachment Invoice-1685008387.pdf" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd" data-tooltip-class="a1V" aria-disabled="false" style="user-select: none;" tabindex="0" data-tooltip="Download">
                  <div class="akn">
                     <div class="aSK J-J5-Ji aYr"></div>
                  </div>
               </div>
               <div id=":qd" class="T-I J-J5-Ji aQv T-I-ax7 L3" role="button" aria-label="Add attachment to Drive Invoice-1685008387.pdf" jslog="54185; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd; 4:WyIjbXNnLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd; 43:WyJhcHBsaWNhdGlvbi9wZGYiLDc4NjAwXQ.." data-tooltip-class="a1V" aria-hidden="false" style="user-select: none;" tabindex="0" data-tooltip="Add to Drive">
                  <div class="akn">
                     <div class="wtScjd J-J5-Ji aYr XG">
                        <div class="T-aT4" style="display: none;">
                           <div></div>
                           <div class="T-aT4-JX"></div>
                        </div>
                     </div>
                  </div>
               </div>
               <div id=":qe" class="T-I J-J5-Ji aQv T-I-ax7 L3" role="button" aria-label="Edit attachment with  Invoice-1685008387.pdf" jslog="92518; u014N:cOuCgd,xr6bB; 1:WyIjdGhyZWFkLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd; 4:WyIjbXNnLWY6MTc2Njg1OTM1NjcxNDQwMjcyOSJd; 43:WyJhcHBsaWNhdGlvbi9wZGYiLG51bGwsMF0." data-tooltip-class="a1V" aria-hidden="true" style="user-select: none; display: none;" data-tooltip="Edit with ">
                  <div class="akn">
                     <div class="aYt J-J5-Ji aYr"></div>
                  </div>
               </div>
            </div>
         </span>
         <div class="aZK"></div>
      </div>
   </div>
   <div class="hi"></div>
   <div class="WhmR8e" data-hash="0"></div>
</div>
  </div>`,
  attachments: [
    { 
      filename: "installment_receipt.pdf",
      path: filePath
    }
  ]
};


    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const PdfPrint = async (req, res) => {
  console.log(req.body.id);
  try {
    const data = await InstallmentModel.find({
      bill_no: req.body.id,
    });
    await generateInstallmentPDF(data);

    return res.json({
      status: 200,
      msg: "Pdf path found",
      data
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, msg: "An error occurred while getting data" });
  }
};

const generateInstallmentPDF = async (installmentData) => {
  console.log(installmentData,"Testing PDF")
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  const templatePath = path.join(
    __dirname,
    "../bill-template",
    "bill-template.html"
  );

  const htmlTemplate = await fs.readFile(templatePath, "utf8");
  const filledTemplate = htmlTemplate
  .replace("{{installment_date}}", new Date().toJSON().slice(0, 10))
  .replace("{{bill_no}}", installmentData.bill_no)
    .replace("{{student_name}}", installmentData.first_name)
    .replace("{{reg_no}}", installmentData.reg_no)
    .replace("{{installment_no}}", installmentData.installment_no)
    .replace("{{installment_amount}}", installmentData.installment_amount)
    .replace("{{installment_total}}", installmentData.installment_amount);
  await page.setContent(filledTemplate);
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });
  const pdfPath = path.join(
    __dirname,
    "../bill-template/pdfs",
    `${installmentData.bill_no}.pdf`
  );
  await fs.writeFile(pdfPath, pdfBuffer);
  await browser.close();

  return true;
};

const GetInstallment = async (req, res) => {
  try {
    const data = await InstallmentModel.find();
    return res.json({
      status: 200,
      msg: "Installment fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetInstallmentOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await InstallmentModel.findOne({ _id: id });
    return res.json({
      status: 200,
      msg: "Installment fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateInstallmentOne = async (req, res) => {
  const { id } = req.params;
  const updateFields = { ...req.body };
  try {
    const Installment = await InstallmentModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    if (!Installment)
      return res
        .status(404)
        .json({ status: 404, msg: "Installment not found" });

    res.json({
      status: 200,
      msg: "Installment updated successfully",
      data: Installment,
    });
    generateInstallmentPDF(Installment);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, msg: "An error occurred while updating data" });
  }
};
const DeleteInstallment = async (req, res) => {
  const { id } = req.params;
  try {
    const Installment = await InstallmentModel.findOneAndDelete({ _id: id });
    return res.json({
      status: 200,
      msg: "Installment deleted successfully",
      data: Installment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, msg: "An error occurred while updating data" });
  }
};
// const SearchByReg = async (req, res) => {
//   const { reg_no, course } = req.body;
//   try {
//     const ExistOrNot = await InstallmentModel.find({ reg_no: reg_no });
//     const payble_amount=await StudentModel.findOne({reg_no:reg_no});
//     const instNo = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
//     let idx =
//       ExistOrNot?.installment_no !== "8th"
//         ? instNo.indexOf(ExistOrNot[ExistOrNot.length - 1]?.installment_no)
//         : "All Completed";
//     if (ExistOrNot.length > 0) {
//       if (idx !== 7) {
//         return res.json({
//           status: 200,
//           msg: "Installment details found",
//           data: {
//             pay_per_month:payble_amount.pay_per_month,
//             course_fees:ExistOrNot[0].course_fees,            
//             due: ExistOrNot[ExistOrNot.length - 1].installment_due,
//             inst_no: instNo[idx + 1],
//           },
//         });
//       }
//       return res.json({
//         status: 200,
//         msg: "Installment details found",
//         data: {
//           pay_per_month:payble_amount.pay_per_month,
//           due: ExistOrNot[ExistOrNot.length - 1].installment_due,
//           inst_no: "All Completed",
//         },
//       });
//     }
//     const dueAmount = await CourseModel.find({ course_name: course });

//     return res.json({
//       status: 200,
//       msg: "Installment details not found",
//       data: {course_fees:dueAmount[0].course_fees, due: dueAmount[0].course_fees, inst_no: "Admission",pay_per_month:12000 },
      
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: 500, msg: "An error occurred while getting data" });
//   }
// };

const SearchByReg = async (req, res) => {
  const { reg_no, course } = req.body;
  try {
    const ExistOrNot = await InstallmentModel.find({ reg_no: reg_no });
    const payble_amount=await StudentModel.findOne({reg_no:reg_no});
    const instNo = generateOrdinalArray(payble_amount.installment_breakup);
    let idx =
      ExistOrNot?.installment_no !== instNo[instNo.length-1]
        ? instNo.indexOf(ExistOrNot[ExistOrNot.length - 1]?.installment_no)
        : "All Completed";
    if (ExistOrNot.length > 0) {
      if (idx !== 7) {
        return res.json({
          status: 200,
          msg: "Installment details found",
          data: {
            pay_per_month:payble_amount.pay_per_month,
            course_fees:ExistOrNot[0].course_fees,            
            due: ExistOrNot[ExistOrNot.length - 1].installment_due,
            inst_no: instNo[idx + 1],
          },
        });
      }
      return res.json({
        status: 200,
        msg: "Installment details found",
        data: {
          pay_per_month:payble_amount.pay_per_month,
          due: ExistOrNot[ExistOrNot.length - 1].installment_due,
          inst_no: "All Completed",
        },
      });
    }
    const dueAmount = await CourseModel.find({ course_name: course });

    return res.json({
      status: 200,
      msg: "Installment details not found",
      data: {course_fees:dueAmount[0].course_fees, due: dueAmount[0].course_fees, inst_no: "Admission",pay_per_month:12000 },
      
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, msg: "An error occurred while getting data" });
  }
};


module.exports = {
  AddInstallment,
  GetInstallment,
  GetInstallmentOne,
  UpdateInstallmentOne,
  DeleteInstallment,
  SearchByReg,
  PdfPrint,
};
