const validator =require('validator');
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name :{type:String,required:true},
    email:{
        type:String,
        required:true,
        lowercase:true,
        validator:(value)=>{
            return validator.isEmail(value)
        }
    },
        dob:{type:String,required:true},
        mobile:{type:String,required:true},
        role:{type:String,default:'Mentor'},
        createedAt:{type:String,default:Date.now},
        students:{type:Array,required:false}
  },
  {
    collection:'mentor',
   
 }

  );

  let mentorModel = mongoose.model('mentor',mentorSchema)
  module.exports={mentorModel}