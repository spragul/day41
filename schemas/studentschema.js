const validator =require('validator');
const mongoose = require('mongoose');

const sudentSchema = new mongoose.Schema({
    name :{type:String,required:true},
    email:{
        type:String,
        required:true,
        lowercase:true,
        validator:(value)=>{
            return validator.isEmail(value)
        }
    },
        rolNumber:{type:String,required:true},
        dob:{type:String,required:true},
        mobile:{type:String,required:true},
        mark:{type:String,required:true},
        role:{type:String,default:'student'},
        mentors:{type:Array,required:false},
        createedAt:{type:String,default:Date.now},
    
  },
  {
    collection:'student',
   
 }

  );

  let studentModel = mongoose.model('student',sudentSchema)
  module.exports={studentModel}