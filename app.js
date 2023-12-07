const express=require('express');
const cors=require('cors');
const path = require('path');
const PORT = process.env.PORT || 4500;
const connectDB = require('./config');
const router=require('./Routes/Router');


const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(cors());

app.use(express.static('public'));


app.get('/t',(req,res)=>{
    res.send('Hello World2');
})

app.get('/api/pdfs/:id', (req, res) => {
    console.log(req.params.id,'test1');
    const pdfPath = path.join(__dirname, 'bill-template', 'pdfs', `${req.params.id}.pdf`);
    res.sendFile(pdfPath);
  });


app.use(router);

app.listen(PORT,function(){
    console.log(`Server Started at ${PORT}`)
})
