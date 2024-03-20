const mongoose = require("mongoose");

const bcrypt = require('bcryptjs');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const EmployeeSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  token:{
    type:String,
    default:null
  }
});

// Mongoose Hooks
EmployeeSchema.pre('save', async function() {
  let hashedString = await bcrypt.hash(this.password, salt);
  this.password = hashedString;
})

const EmployeeModel = mongoose.model("employees",EmployeeSchema);
module.exports = EmployeeModel;
