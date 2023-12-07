const puppeteer = require('puppeteer');

async function htmlToPdf(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content to the HTML provided
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  // Generate PDF
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
}

// Example usage
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

<title>Invoice</title>

<!-- Bootstrap cdn 3.3.7 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

<!-- Custom font montseraat -->
<link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700" rel="stylesheet">

<!-- Custom style invoice1.css -->
<!-- <link rel="stylesheet" type="text/css" href="/bill-template/invoice1.css"> -->
<style>
.back{}
.invoice-wrapper{
margin: 20px auto;
max-width: 700px;
box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
.invoice-top{
background-color: #fafafa;
padding: 40px 60px;
}
/*
Invoice-top-left refers to the client name & address, service provided
*/
.invoice-top-left{
margin-top: 60px;
}
.invoice-top-left h2 , .invoice-top-left h6{
line-height: 1.5;
font-family: 'Montserrat', sans-serif;
}
.invoice-top-left h4{
margin-top: 30px;
font-family: 'Montserrat', sans-serif;
}
.invoice-top-left h5{
line-height: 1.4;
font-family: 'Montserrat', sans-serif;
font-weight: 400;
}
.client-company-name{
font-size: 20px;
font-weight: 600;
margin-bottom: 0;
}
.client-address{
font-size: 14px;
margin-top: 5px;
color: rgba(0,0,0,0.75);
}

/*
Invoice-top-right refers to the our name & address, logo and date
*/
.invoice-top-right{
display: flex;
flex-direction: column;
justify-content: space-between;
gap: 25px;
}
.invoice-top-right h2 , .invoice-top-right h6{
line-height: 1.5;
font-family: 'Montserrat', sans-serif;
}
.invoice-top-right h5{
line-height: 1.4;
font-family: 'Montserrat', sans-serif;
font-weight: 400;
margin-top: 0;
text-align: center;
}
.our-company-name{
font-size: 16px;
font-weight: 600;
margin-bottom: 0;
}
.our-address{
font-size: 13px;
margin-top: 0;
color: rgba(0,0,0,0.75);
}
.logo-wrapper{ overflow: auto; }

/*
Invoice-bottom refers to the bottom part of invoice template
*/
.invoice-bottom{
background-color: #ffffff;
padding: 40px 60px;
position: relative;
}
.title{
font-size: 30px;
font-family: 'Montserrat', sans-serif;
font-weight: 600;
margin-bottom: 30px;
}
/*
Invoice-bottom-left
*/
.invoice-bottom-left h5, .invoice-bottom-left h4{
font-family: 'Montserrat', sans-serif;
}
.invoice-bottom-left h4{
font-weight: 400;
}
.terms{
font-family: 'Montserrat', sans-serif;
font-size: 14px;
margin-top: 40px;
}
.divider{
margin-top: 50px;
margin-bottom: 5px;
}
/*
bottom-bar is colored bar located at bottom of invoice-card
*/
.bottom-bar{
position: absolute;
bottom: 0;
left: 0;
right: 0;
height: 26px;
background-color: #323149;
}
.footer-links a{
text-decoration: none;
}
</style>
</head>
<body>
<section class="back">
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <div class="invoice-wrapper">
                <div class="invoice-top">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="invoice-top-left">
                                <h2 class="client-company-name">Adret Software</h2>
                                <h6 class="client-address">Unit 206, Merlin Matrix, DN 10, Sector V, Salt Lake, Kolkata - 700091</h6>
                            </div>
                        </div>
                        <div class="col-sm-6 mt-4">
                            <div class="invoice-top-right">
                                
                                <div class="logo-wrapper">
                                    <img src="http://127.0.0.1:5501/bill-template/adret-logo1.png" class="img-responsive pull-right logo" />
                                </div>
                                <h5>06 September 2023</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="invoice-bottom">
                    <div class="row">

                        <div class="col-md-offset-1 col-12">
                            <div class="invoice-bottom-right">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Bill No.</th>
                                            <th>Student Name</th>
                                            <th>Student Registration No.</th>
                                            <th>Installment No.</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{bill_no}}</td>
                                            <td>{{student_name}}</td>
                                            <td>{{reg_no}}</td>
                                            <td>{{installment_no}}</td>
                                            <td>{{installment_amount}}</td>
                                        </tr>
                                        <tr style="height: 40px;"></tr>
                                    </tbody>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>Total</th>
                                            <th>₹8,000</th>
                                        </tr>
                                    </thead>
                                </table>
                                <h4 class="terms">Terms</h4>
                                <ul>
                                    <li>Invoice to be paid in advance.</li>
                                </ul>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-xs-12">
                            <hr class="divider">
                        </div>
                        <div class="col-sm-4 footer-links">
                            <!-- <h6 class="text-left">acme.com</h6> -->
                            <a href="https://adretacademy.com/">adretacademy.com</a>
                        </div>
                        <div class="col-sm-4 footer-links">
                            <a href="mailto:info@adretacademy.com">info@adretacademy.com</a>
                        </div>
                        <div class="col-sm-4 footer-links">
                            <a href="tel:+91 9477966119">+91 9477966119</a>
                        </div>
                    </div>
                    <div class="bottom-bar"></div>
                </div>
            </div>
        </div>
    </div>
</div>
</section>


	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha256-k2WSCIexGzOj3Euiig+TlR8gA0EmPjuc79OEeY5L45g=" crossorigin="anonymous"></script>

	
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>
</html>`;
const outputPath = 'output.pdf';

htmlToPdf(htmlContent, outputPath)
  .then(() => console.log('PDF generated successfully'))
  .catch(error => console.error('Error generating PDF:', error));
