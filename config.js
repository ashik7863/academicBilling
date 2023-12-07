const mongoose=require('mongoose');


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb+srv://ashik123:7872145792@cluster0.iptlfq6.mongodb.net/academicbilling?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  module.exports = connectDB;
